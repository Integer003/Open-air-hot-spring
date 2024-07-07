package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

case class GoodsAddCommentsMessagePlanner(goodsID: Int, senderName: String, content: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))

    // 插入一行新的评论到 comments 表
    val query = s"INSERT INTO ${schemaName}.comments (sender_name, goods_id, time, content) VALUES (?, ?, ?, ?)"

    writeDB(
      query,
      List(
        SqlParameter("String", senderName),
        SqlParameter("Int", goodsID.toString),
        SqlParameter("String", currentTime),
        SqlParameter("String", content)
      )
    ).map { _ =>
      s"Success: Comment added successfully for goods ID '$goodsID'."
    }
  }
}
