// SellerQueryStorageMessagePlanner.scala
package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import io.circe.syntax.*
import io.circe.{Decoder, Encoder, HCursor, Json}
import cats.syntax.all.*

case class StorageInfo(goodsID: String, goodsName: String, price: BigDecimal, description: String, condition: String, sellerName: String, buyerName: Option[String])

object StorageInfo {
  implicit val decoder: Decoder[StorageInfo] = new Decoder[StorageInfo] {
    final def apply(c: HCursor): Decoder.Result[StorageInfo] =
      for {
        goodsID <- c.downField("goodsID").as[String].orElse(c.downField("goodsID").as[Int].map(_.toString))
        goodsName <- c.downField("goodsName").as[String]
        price <- c.downField("price").as[BigDecimal]
        description <- c.downField("description").as[String]
        condition <- c.downField("condition").as[String]
        sellerName <- c.downField("sellerName").as[String]
        buyerName <- c.downField("buyerName").as[Option[String]]
      } yield StorageInfo(goodsID, goodsName, price, description, condition, sellerName, buyerName)
  }
}

case class SellerQueryStorageMessagePlanner(userName: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // 查询 goods_info 中 condition 为 'false' 且 seller_name 为当前用户的数据
    val query = s"SELECT goods_id, goods_name, price, description, condition, seller_name, buyer_name FROM goods.goods_info WHERE condition = 'false' AND seller_name = ?"

    readDBRows(query, List(SqlParameter("String", userName))).flatMap { rows =>
      // 解码 rows 为 StorageInfo 然后转换为 JSON 字符串
      IO.fromEither(rows.traverse(row => row.as[StorageInfo])).map { storageInfoList =>
        storageInfoList.asJson.spaces2
      }
    }
  }
