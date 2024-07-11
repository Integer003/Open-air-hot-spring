package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.syntax.all.*
import Common.ServiceUtils.schemaName
import io.circe.generic.auto.*

case class ReadNewsMessagePlanner(newsID: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // 查询数据库中当前 newsID 的 condition 值
    val selectQuery = s"SELECT condition FROM ${schemaName}.news WHERE news_id = ?"

    readDBString(selectQuery, List(SqlParameter("Int", newsID))).flatMap { currentCondition =>
      // 如果当前 condition 已经是 "true"，直接返回成功信息
      if (currentCondition == "true") {
        IO.pure(s"Success: news ID $newsID is already read.")
      } else {
        // 更新数据库中对应 newsID 的 condition 值为 "true"
        val updateQuery = s"UPDATE ${schemaName}.news SET condition = 'true' WHERE news_id = ?"

        writeDB(updateQuery, List(SqlParameter("Int", newsID))).flatMap { updateResult =>
          if (updateResult.nonEmpty) {
            // 更新成功，返回成功信息
            IO.pure(s"Success: updated news ID $newsID condition to 'true'.")
          } else {
            // 更新失败，返回错误信息
            IO.raiseError(new Exception(s"Failed to update condition for news ID $newsID."))
          }
        }
      }
    }.handleErrorWith {
      // 错误处理
      case e: Throwable => IO.raiseError(new Exception(s"Error: ${e.getMessage}"))
    }
  }
}
