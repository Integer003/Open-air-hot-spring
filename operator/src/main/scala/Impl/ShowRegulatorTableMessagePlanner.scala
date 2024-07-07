// ShowRegulatorTableMessagePlanner.scala
package Impl

import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class ShowRegulatorTableMessagePlanner(override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // Query the database to get all sellers
    // 由于schemaName只能方便的访问自身数据库，但是这里需要访问其他服务管理的数据库，我只能直接使用其他服务的schema名字了
    readDBRows(s"SELECT * FROM regulator.user_name", List.empty).map { rows =>
      // Convert the list of JSON objects to a formatted string
      rows.map(_.noSpaces).mkString("\n")
    }
  }
