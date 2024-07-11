package Impl

import cats.effect.IO
import io.circe.generic.auto._
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class SellerDeleteGoodsCartMessagePlanner(userName: String, goodsID: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    for {
      _ <- writeDB(
        s"DELETE FROM ${schemaName}.cart WHERE user_name = ? AND goods_id = ?",
        List(
          SqlParameter("String", userName),
          SqlParameter("Int", goodsID.toString)
        )
      )
    } yield s"Success: Goods ID '$goodsID' removed from cart for user '$userName'."
  }
}
