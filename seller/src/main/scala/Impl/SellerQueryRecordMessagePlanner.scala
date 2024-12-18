// SellerQueryRecordMessagePlanner.scala
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

case class StorageInfoRecord(goodsID: String, goodsName: String, price: BigDecimal, description: String, condition: String, sellerName: String, buyerName: Option[String], verify: Option[String] = None, star: String)

object StorageInfoRecord {
  implicit val decoder: Decoder[StorageInfoRecord] = new Decoder[StorageInfoRecord] {
    final def apply(c: HCursor): Decoder.Result[StorageInfoRecord] =
      for {
        goodsID <- c.downField("goodsID").as[String].orElse(c.downField("goodsID").as[Int].map(_.toString))
        goodsName <- c.downField("goodsName").as[String]
        price <- c.downField("price").as[BigDecimal]
        description <- c.downField("description").as[String]
        condition <- c.downField("condition").as[String]
        sellerName <- c.downField("sellerName").as[String]
        buyerName <- c.downField("buyerName").as[Option[String]]
        verify <- c.downField("verify").as[Option[String]]
        star <- c.downField("star").as[String].orElse(c.downField("star").as[Int].map(_.toString))
      } yield StorageInfoRecord(goodsID, goodsName, price, description, condition, sellerName, buyerName, verify, star)
  }
}

case class SellerQueryRecordMessagePlanner(userName: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // 查询 goods_info 中 condition 为 'false' 且 seller_name 为当前用户的数据
    val query = s"SELECT goods_id, goods_name, price, description, condition, seller_name, buyer_name, verify, star FROM goods.goods_info WHERE buyer_name = ?"

    readDBRows(query, List(SqlParameter("String", userName))).flatMap { rows =>
      // 解码 rows 为 StorageInfoRecord 然后转换为 JSON 字符串
      IO.fromEither(rows.traverse(row => row.as[StorageInfoRecord])).map { storageInfoList =>
        storageInfoList.asJson.spaces2
      }
    }
  }
