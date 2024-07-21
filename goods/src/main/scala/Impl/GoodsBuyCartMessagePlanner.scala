package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import APIs.SellerAPI.AddNewsMessage
import cats.Traverse.ops.toAllTraverseOps
import cats.Alternative.ops.toAllAlternativeOps

case class GoodsBuyCartMessagePlanner(buyerName: String, goodsIDList: List[String], override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    startTransaction{
      for {
        // 获取所有商品信息
        goodsInfoList <- goodsIDList.traverse { goodsID =>
          readDBRows(
            s"SELECT seller_name, price, condition FROM ${schemaName}.goods_info WHERE goods_id = ?",
            List(SqlParameter("Int", goodsID))
          ).map(_.headOption.toRight(new Exception(s"Goods with ID '$goodsID' not found")))
        }.map(_.sequence)

        // 检查是否有重复的商品ID
        _ <- IO.raiseWhen(goodsIDList.distinct.size != goodsIDList.size)(new Exception("Duplicate goods IDs found"))

        // 确保所有商品都存在
        goodsInfo <- IO.fromEither(goodsInfoList)

        // 确保所有商品未售出且获取总价
        totalPrice <- goodsInfo.traverse {
          case (goodsInfo) =>
            for {
              condition <- IO.fromOption(goodsInfo.hcursor.get[String]("condition").toOption)(new Exception("Condition not found"))
              _ <- if (condition == "false") IO.unit else IO.raiseError(new Exception(s"Goods with ID '${goodsInfo.hcursor.get[String]("goods_id").getOrElse("")}' already sold"))
              price <- IO.fromOption(goodsInfo.hcursor.get[Int]("price").toOption)(new Exception("Price not found"))
            } yield price
        }.map(_.sum)

        // 获取 buyer 的当前余额
        buyerMoney <- readDBInt(
          s"SELECT money FROM seller.user_name WHERE user_name = ?",
          List(SqlParameter("String", buyerName))
        )

        // 确保 buyer 余额足够
        _ <- if (buyerMoney >= totalPrice) IO.unit else IO.raiseError(new Exception("Insufficient balance"))

        // 开始更新数据库，先将所有 goods_info 表更新，再更新 seller 和 buyer 的余额
        _ <- goodsIDList.traverse { goodsID =>
          writeDB(
            s"UPDATE ${schemaName}.goods_info SET condition = 'true', buyer_name = ? WHERE goods_id = ?",
            List(
              SqlParameter("String", buyerName),
              SqlParameter("Int", goodsID)
            )
          )
        }

        // 更新 seller 表中的 money
        _ <- goodsInfo.traverse { goodsInfo =>
          val sellerName = goodsInfo.hcursor.get[String]("sellerName").getOrElse(throw new Exception("Seller name not found"))
          val price = goodsInfo.hcursor.get[Int]("price").getOrElse(throw new Exception("Price not found"))
          writeDB(
            s"UPDATE seller.user_name SET money = money + ? WHERE user_name = ?",
            List(
              SqlParameter("Int", price.toString),
              SqlParameter("String", sellerName)
            )
          )
        }

        // 更新 buyer 表中的 money
        _ <- writeDB(
          s"UPDATE seller.user_name SET money = money - ? WHERE user_name = ?",
          List(
            SqlParameter("Int", totalPrice.toString),
            SqlParameter("String", buyerName)
          )
        )


      } yield s"Success: All goods in the cart updated successfully and money transferred."
    }

  }
