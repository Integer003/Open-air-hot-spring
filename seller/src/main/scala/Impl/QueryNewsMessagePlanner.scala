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

case class NewsInfo(newsID: String, receiver: String, receiverType: String, newsType: String, newsTime: String, content: String, condition: String)

object NewsInfo {
  implicit val decoder: Decoder[NewsInfo] = new Decoder[NewsInfo] {
    final def apply(c: HCursor): Decoder.Result[NewsInfo] =
      for {
        newsID <- c.downField("newsID").as[String].orElse(c.downField("newsID").as[Int].map(_.toString))
        receiver <- c.downField("receiver").as[String]
        receiverType <- c.downField("receiverType").as[String]
        newsType <- c.downField("newsType").as[String]
        newsTime <- c.downField("newsTime").as[String]
        content <- c.downField("content").as[String]
        condition <- c.downField("condition").as[String]
      } yield NewsInfo(newsID, receiver, receiverType, newsType, newsTime, content, condition)
  }
}

case class QueryNewsMessagePlanner(receiver: String, receiverType: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // 查询 seller.news 表中 receiver 等于给定 receiver 的所有行
    val query = s"SELECT news_id, receiver, receiver_type, news_type, news_time, content, condition FROM ${schemaName}.news WHERE receiver = ? AND receiver_type = ?"

    readDBRows(query,
      List(
        SqlParameter("String", receiver),
        SqlParameter("String", receiverType)
      )
    ).flatMap { rows =>
      // 调试输出查询结果
      IO {
        println(rows)
        rows
      }.flatMap { rows =>
        // Decode rows to GoodsInfo and then convert to JSON string
        IO.fromEither(rows.traverse(row => row.as[GoodsInfo])).map { goodsInfoList =>
          goodsInfoList.asJson.spaces2
        }
      }
    }
  }
}

