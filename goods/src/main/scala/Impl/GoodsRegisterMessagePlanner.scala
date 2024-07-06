package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class GoodsRegisterMessagePlanner(
                                        itemName: String,
                                        price: Double,
                                        condition: String,
                                        sellerId: Long,
                                        override val planContext: PlanContext
                                      ) extends Planner[String] {

  override def plan(using planContext: PlanContext): IO[String] = {
    // Check if the item already exists
    val checkItemExists = readDBBoolean(
      s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.goods WHERE item_name = ? AND seller_id = ?)",
      List(
        SqlParameter("String", itemName),
        SqlParameter("Long", sellerId)
      )
    )

    checkItemExists.flatMap { exists =>
      if (exists) {
        IO.raiseError(new Exception("item already registered"))
      } else {
        writeDB(
          s"INSERT INTO ${schemaName}.goods (item_name, price, condition, seller_id) VALUES (?, ?, ?, ?)",
          List(
            SqlParameter("String", itemName),
            SqlParameter("Double", price),
            SqlParameter("String", condition),
            SqlParameter("Long", sellerId)
          )
        ).map(_ => "Item registered successfully")
      }
    }
  }
}
