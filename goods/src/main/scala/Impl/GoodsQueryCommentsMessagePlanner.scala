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

case class CommentInfo(commentId: Int, senderName: String, goodsId: Int, time: String, content: String)

object CommentInfo {
  implicit val decoder: Decoder[CommentInfo] = new Decoder[CommentInfo] {
    final def apply(c: HCursor): Decoder.Result[CommentInfo] =
      for {
        commentId <- c.downField("commentID").as[Int] // ***********
        senderName <- c.downField("senderName").as[String]
        goodsId <- c.downField("goodsID").as[Int]
        time <- c.downField("time").as[String]
        content <- c.downField("content").as[String]
      } yield CommentInfo(commentId, senderName, goodsId, time, content)
  }
}

case class GoodsQueryCommentsMessagePlanner(goodsID: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // 查询 goods.comments 表中 goods_id 等于给定 goodsID 的所有行
    val query = s"SELECT comment_id, sender_name, goods_id, time, content FROM ${schemaName}.comments WHERE goods_id = ?"

    readDBRows(query, List(SqlParameter("Int", goodsID.toString))).flatMap { rows =>
      // 调试输出查询结果
      IO {
        println(rows)
        rows
      }.flatMap { rows =>
        // Decode rows to CommentInfo and then convert to JSON string
        IO.fromEither(rows.traverse(row => row.as[CommentInfo])).map { commentInfoList =>
          commentInfoList.asJson.spaces2
        }
      }
    }
  }
}
