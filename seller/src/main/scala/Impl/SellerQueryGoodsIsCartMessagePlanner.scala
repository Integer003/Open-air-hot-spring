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

case class CartGoods(goodsID: String)

object CartGoods {
  implicit val decoder: Decoder[CartGoods] = new Decoder[CartGoods] {
    final def apply(c: HCursor): Decoder.Result[CartGoods] =
      for {
        goodsID <- c.downField("goodsID").as[String].orElse(c.downField("goodsID").as[Int].map(_.toString))
      } yield CartGoods(goodsID)
  }
}

case class SellerQueryGoodsIsCartMessagePlanner(userName: String, override val planContext: PlanContext) extends Planner[String] :
  override def plan(using planContext: PlanContext): IO[String] = {
    // 查询 cart 表中 user_name 等于给定 userName 的所有 goods_id 记录
    val query = s"SELECT goods_id FROM ${schemaName}.cart WHERE user_name = ?"

    readDBRows(query, List(SqlParameter("String", userName))).flatMap { rows =>
      IO.fromEither(rows.traverse(row => row.as[CartGoods])).map { goodsInfoList =>
        goodsInfoList.asJson.spaces2
      }
    }
  }
