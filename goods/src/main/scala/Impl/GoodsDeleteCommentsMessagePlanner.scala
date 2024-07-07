package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName

case class GoodsDeleteCommentsMessagePlanner(commentID: Int, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // Check if the comment exists
    val checkCommentExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.comments WHERE comment_id = ?)",
      List(SqlParameter("Int", commentID.toString))
    )

    checkCommentExists.flatMap { exists =>
      if (!exists) {
        IO.pure("comment not found")
      } else {
        writeDB(s"DELETE FROM ${schemaName}.comments WHERE comment_ID = ?",
          List(SqlParameter("Int", commentID.toString))
        ).map { _ =>
          s"Comment with commentID: $commentID deleted successfully."
        }
      }
    }
  }

