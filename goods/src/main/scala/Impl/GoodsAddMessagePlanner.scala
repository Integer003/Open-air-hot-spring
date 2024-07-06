package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName

case class GoodsAddMessagePlanner(goodsName: String, price: Int, description: String, condition: String, sellerName: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // Insert the new goods into the database
    writeDB(s"INSERT INTO ${schemaName}.goods_info (goods_name, price, description, condition, seller_name) VALUES (?, ?, ?, ?, ?)",
      List(
        SqlParameter("String", goodsName),
        SqlParameter("Int", price.toString), // 确保类型一致
        SqlParameter("String", description),
        SqlParameter("String", condition),
        SqlParameter("String", sellerName)
      )
    ).map { _ =>
      s"Goods '$goodsName' added successfully."
    }
  }