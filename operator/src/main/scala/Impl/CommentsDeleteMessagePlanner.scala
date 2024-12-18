// CommentsDeleteMessagePlanner.scala
package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.syntax.all.*
import io.circe.generic.auto.deriveEncoder

case class CommentsDeleteMessagePlanner(commentID: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // 删除数据库中对应 goodsID 的数据
    val deleteQuery = s"DELETE FROM goods.comments WHERE comment_id = ?"

    writeDB(deleteQuery, List(SqlParameter("Int", commentID.toString))).flatMap { result =>
      if (result.nonEmpty) {
        // 删除成功，返回成功信息
        IO.pure(s"Success: deleted comments ID is $commentID.")
      } else {
        // 没有找到对应的记录，返回错误信息
        IO.raiseError(new Exception(s"No comments found with ID $commentID."))
      }
    }
  }
}
