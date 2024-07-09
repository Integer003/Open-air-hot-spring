package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import io.circe.syntax.*
import io.circe.{Decoder, Encoder, HCursor, Json}

case class StarCount(count: Int)

object StarCount {
  implicit val encoder: Encoder[StarCount] = new Encoder[StarCount] {
    final def apply(a: StarCount): Json = Json.obj(
      ("count", Json.fromInt(a.count))
    )
  }
}

case class GoodsQueryStarMessagePlanner(goodsID: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // 查询 star 表中 goods_id 等于给定 goodsID 的所有记录的数量
    val query = s"SELECT COUNT(*) AS count FROM ${schemaName}.star WHERE goods_id = ?"

    readDBRows(query, List(SqlParameter("Int", goodsID.toString))).flatMap { rows =>
      val count = rows.headOption.flatMap(row => row.hcursor.get[Int]("count").toOption).getOrElse(0)
      IO.pure(StarCount(count).asJson.spaces2)
    }
  }
}
