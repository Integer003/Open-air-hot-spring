package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName

case class GoodsBuyMessagePlanner(buyerName: String, goodsID: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    startTransaction{
      for {
        // 获取 goods_info 表中的 seller_name 和 price
        goodsInfo <- readDBRows(
          s"SELECT seller_name, price FROM ${schemaName}.goods_info WHERE goods_id = ?",
          List(SqlParameter("Int", goodsID))
        ).map(_.headOption)

        // 确保数据存在
        sellerName <- IO.fromOption(goodsInfo.flatMap(_.hcursor.get[String]("sellerName").toOption))(new Exception("Seller not found"))
        price <- IO.fromOption(goodsInfo.flatMap(_.hcursor.get[Int]("price").toOption))(new Exception("Price not found"))

        // 获取 buyer 的当前余额
        buyerMoney <- readDBInt(
          s"SELECT money FROM seller.user_name WHERE user_name = ?",
          List(SqlParameter("String", buyerName))
        )

        // 确保 buyer 余额足够
        _ <- if (buyerMoney >= price) IO.unit else IO.raiseError(new Exception("余额不足"))
        // 商品状态
        goodsCondition <- readDBString(
          s"SELECT condition FROM goods.goods_info WHERE goods_id = ? ",
          List(SqlParameter("Int", goodsID))
        )

        // 确保 未售出
        _ <- if (goodsCondition == "false") IO.unit else IO.raiseError(new Exception("商品已售出"))

        // 更新 goods_info 表
        _ <- writeDB(
          s"UPDATE ${schemaName}.goods_info SET condition = 'true', buyer_name = ? WHERE goods_id = ?",
          List(
            SqlParameter("String", buyerName),
            SqlParameter("Int", goodsID)
          )
        )

        // 更新 seller 表中的 money
        _ <- writeDB(
          s"UPDATE seller.user_name SET money = money + ? WHERE user_name = ?",
          List(
            SqlParameter("Int", price.toString),
            SqlParameter("String", sellerName)
          )
        )

        // 更新 buyer 表中的 money
        _ <- writeDB(
          s"UPDATE seller.user_name SET money = money - ? WHERE user_name = ?",
          List(
            SqlParameter("Int", price.toString),
            SqlParameter("String", buyerName)
          )
        )
      } yield s"Success: Goods with ID '$goodsID' updated successfully and money transferred."
    }
    
  }
