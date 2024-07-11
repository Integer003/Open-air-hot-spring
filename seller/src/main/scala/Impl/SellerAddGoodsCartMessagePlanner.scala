package Impl

import cats.effect.IO
import io.circe.generic.auto._
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

case class SellerAddGoodsCartMessagePlanner(userName: String, goodsID: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    for {
      _ <- writeDB(
        s"INSERT INTO ${schemaName}.cart (user_name, goods_id, time) VALUES (?, ?, ?)",
        List(
          SqlParameter("String", userName),
          SqlParameter("Int", goodsID.toString),
          SqlParameter("String", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
        )
      )
    } yield s"Success: Goods ID '$goodsID' added to cart for user '$userName'."
  }
}
