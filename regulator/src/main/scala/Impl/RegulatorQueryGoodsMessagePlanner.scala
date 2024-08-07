// SellerQueryGoodsMessagePlanner.scala
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

case class GoodsInfo(goodsID: String, goodsName: String, price: BigDecimal, description: String, sellerName: String, verify: String, imageUrl: String)

object GoodsInfo {
  implicit val decoder: Decoder[GoodsInfo] = new Decoder[GoodsInfo] {
    final def apply(c: HCursor): Decoder.Result[GoodsInfo] =
      for {
        goodsID <- c.downField("goodsID").as[String].orElse(c.downField("goodsID").as[Int].map(_.toString))
        goodsName <- c.downField("goodsName").as[String]
        price <- c.downField("price").as[BigDecimal]
        description <- c.downField("description").as[String]
        sellerName <- c.downField("sellerName").as[String]
        verify <- c.downField("verify").as[String]
        imageUrl <- c.downField("imageUrl").as[String]
      } yield GoodsInfo(goodsID, goodsName, price, description, sellerName, verify, imageUrl)
  }
}

case class RegulatorQueryGoodsMessagePlanner(override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // Query goods_info for entries with condition 'false' and seller_name not equal to the provided userName
    val query = s"SELECT goods_id, goods_name, price, description, seller_name, verify, image_url FROM goods.goods_info"

    readDBRows(query, List()).flatMap { rows =>
      // Decode rows to GoodsInfo and then convert to JSON string
      IO.fromEither(rows.traverse(row => row.as[GoodsInfo])).map { goodsInfoList =>
        goodsInfoList.asJson.spaces2
      }
    }
  }
