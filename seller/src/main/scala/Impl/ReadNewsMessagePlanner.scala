package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

case class ReadNewsMessagePlanner(newsID: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // 将 newsID 转换为 Int
    val parseNewsID: IO[Int] = IO(newsID.toInt)

    parseNewsID.flatMap { newsIdInt =>
      // 更新 seller.news 表中 news_id=newsID 的行，设置 condition 字段为 "right"
      val updateQuery = s"UPDATE ${schemaName}.news SET condition = 'right' WHERE news_id = ?"
      writeDB(updateQuery, List(SqlParameter("Int", newsID))).flatMap { updateResult =>
        if (updateResult.nonEmpty) {
          // 更新成功，返回成功信息
          IO.pure(s"Success: updated news ID $newsID condition to right.")
        } else {
          // 更新失败，返回错误信息
          IO.raiseError(new Exception(s"Failed to update condition for news ID $newsID."))
        }
      }
    }.handleErrorWith {
      // 错误处理
      case e: Throwable => IO.raiseError(new Exception(s"Error: ${e.getMessage}"))
    }
  }
}
