package Impl

import cats.effect.IO
import io.circe.generic.auto._
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class GoodsSearchMessagePlanner(
                                      itemName: String,
                                      override val planContext: PlanContext
                                    ) extends Planner[List[Goods]] {

  override def plan(using planContext: PlanContext): IO[List[Goods]] = {
    // Construct SQL query to search for goods by item name
    val query =
      s"SELECT item_name, price, condition, seller_id FROM ${schemaName}.goods WHERE item_name LIKE ?"

    // Execute the query
    readDBRows(query, List(SqlParameter("String", s"%$itemName%"))).map { rows =>
      rows.map { row =>
        Goods(
          row("item_name").asInstanceOf[String],
          row("price").asInstanceOf[Double],
          row("condition").asInstanceOf[String],
          row("seller_name").asInstanceOf[Long]
        )
      }
    }
  }
}
