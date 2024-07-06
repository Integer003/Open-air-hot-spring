// ClearTableMessagePlanner.scala
package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.generic.auto.*

case class ClearTableMessagePlanner(override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // 清空 seller.user_name 表中的所有记录
    writeDB(s"DELETE FROM seller.user_name", List.empty).map { _ =>
      "Table cleared successfully"
    }
  }