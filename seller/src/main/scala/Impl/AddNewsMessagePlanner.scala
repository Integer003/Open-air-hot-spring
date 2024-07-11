package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

case class AddNewsMessagePlanner(receiver: String, receiverType: String, newsType: String, content: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))

    // 插入一行新的消息到 news 表
    val query = s"INSERT INTO ${schemaName}.news (receiver, receiver_type, news_type, news_time, content, condition) VALUES (?, ?, ?, ?, ?, ?)"

    writeDB(
      query,
      List(
        SqlParameter("String", receiver),
        SqlParameter("String", receiverType),
        SqlParameter("String", newsType),
        SqlParameter("String", currentTime),
        SqlParameter("String", content),
        SqlParameter("String", "false")
      )
    ).map { _ =>
      s"Success: News added successfully for newsType '$newsType'."
    }
  }
}
