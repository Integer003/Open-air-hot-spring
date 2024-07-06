// ShowTableMessagePlanner.scala
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

case class ShowTableMessagePlanner(override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // Query the database to get all sellers
    readDBRows(s"SELECT * FROM ${schemaName}.seller", List.empty).map { rows =>
      // Convert the list of JSON objects to a formatted string
      rows.map(_.noSpaces).mkString("\n")
    }
  }
