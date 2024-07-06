package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class GoodsLoginMessagePlanner(itemName: String, condition: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // Attempt to validate the item by reading the rows from the database
    readDBRows(
      s"SELECT item_name FROM ${schemaName}.goods WHERE item_name = ? AND condition = ?",
      List(SqlParameter("String", itemName), SqlParameter("String", condition))
    ).map {
      case Nil => "Invalid Goods"
      case _ => "Valid Goods"
    }
  }
}
