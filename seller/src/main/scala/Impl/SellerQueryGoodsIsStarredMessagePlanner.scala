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

case class StarredGoods(goodsID: String)

object StarredGoods {
  implicit val decoder: Decoder[StarredGoods] = new Decoder[StarredGoods] {
    final def apply(c: HCursor): Decoder.Result[StarredGoods] =
      for {
        goodsID <- c.downField("goodsID").as[String].orElse(c.downField("goodsID").as[Int].map(_.toString))
      } yield StarredGoods(goodsID)
  }
}

case class SellerQueryGoodsIsStarredMessagePlanner(userName: String, override val planContext: PlanContext) extends Planner[String] :
  override def plan(using planContext: PlanContext): IO[String] = {
    // 查询 star 表中 user_name 等于给定 userName 的所有 goods_id 记录
    val query = s"SELECT goods_id FROM goods.star WHERE user_name = ?"

    readDBRows(query, List(SqlParameter("String", userName))).flatMap { rows =>
//      val goodsIDs = rows.flatMap(row => row.hcursor.get[Int]("goods_id").toOption)
//      IO.pure(StarredGoods(goodsIDs).asJson.spaces2)
      IO.fromEither(rows.traverse(row => row.as[StarredGoods])).map { goodsInfoList =>
        goodsInfoList.asJson.spaces2
      }
    }
  }

