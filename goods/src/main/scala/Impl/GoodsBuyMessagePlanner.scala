// GoodsBuyMessagePlanner.scala
package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName

case class GoodsBuyMessagePlanner(sellerName: String, goodsID: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // Update the goods_info in the database
    writeDB(s"UPDATE ${schemaName}.goods_info SET condition = 'true', buyer_name = ? WHERE goods_id = ?",
      List(
        SqlParameter("String", sellerName),
        SqlParameter("Int", goodsID)
      )
    ).map { _ =>
      s"Success: Goods with ID '$goodsID' updated successfully."
    }
  }
