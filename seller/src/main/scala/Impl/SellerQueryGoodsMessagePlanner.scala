//// SellerQueryGoodsMessagePlanner.scala
//package Impl
//
//import cats.effect.IO
//import io.circe.generic.auto.*
//import Common.API.{PlanContext, Planner}
//import Common.DBAPI.*
//import Common.Object.SqlParameter
//import Common.ServiceUtils.schemaName
//import io.circe.{Decoder, Encoder, HCursor, Json}
//import cats.syntax.all.*
//
//case class GoodsInfo(goodsID: String, goodsName: String, price: BigDecimal, description: String, sellerName: String)
//
//case class SellerQueryGoodsMessagePlanner(userName: String, override val planContext: PlanContext) extends Planner[List[GoodsInfo]]:
//  override def plan(using planContext: PlanContext): IO[List[GoodsInfo]] = {
//    // Query goods_info for entries with condition false and seller_name not equal to the provided userName
//    val query = s"SELECT goods_id, goods_name, price, description, seller_name FROM goods.goods_info WHERE condition = 'false' AND seller_name != ?"
//
//    readDBRows(query, List(SqlParameter("String", userName))).flatMap { rows =>
//      IO.fromEither(rows.traverse { row =>
//        for {
//          goodsID <- row.hcursor.get[String]("goods_id")
//          goodsName <- row.hcursor.get[String]("goods_name")
//          price <- row.hcursor.get[BigDecimal]("price")
//          description <- row.hcursor.get[String]("description")
//          sellerName <- row.hcursor.get[String]("seller_name")
//        } yield GoodsInfo(goodsID, goodsName, price, description, sellerName)
//      })
//    }
//  }

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

case class GoodsInfo(goodsID: String, goodsName: String, price: BigDecimal, description: String, sellerName: String)

object GoodsInfo {
  implicit val decoder: Decoder[GoodsInfo] = new Decoder[GoodsInfo] {
    final def apply(c: HCursor): Decoder.Result[GoodsInfo] =
      for {
        goodsID <- c.downField("goodsID").as[String].orElse(c.downField("goodsID").as[Int].map(_.toString))
        goodsName <- c.downField("goodsName").as[String]
        price <- c.downField("price").as[BigDecimal]
        description <- c.downField("description").as[String]
        sellerName <- c.downField("sellerName").as[String]
      } yield GoodsInfo(goodsID, goodsName, price, description, sellerName)
  }
}

case class SellerQueryGoodsMessagePlanner(userName: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // Query goods_info for entries with condition 'false' and seller_name not equal to the provided userName
    val query = s"SELECT goods_id, goods_name, price, description, seller_name FROM goods.goods_info WHERE condition = 'false' AND seller_name != ?"

    readDBRows(query, List(SqlParameter("String", userName))).flatMap { rows =>
      // Decode rows to GoodsInfo and then convert to JSON string
      IO.fromEither(rows.traverse(row => row.as[GoodsInfo])).map { goodsInfoList =>
        goodsInfoList.asJson.spaces2
      }
    }
  }

