package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class GoodsDeleteStarMessagePlanner(goodsID: Int, userName: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // 检查 star 记录是否存在
//    val checkStarExists = readDBBoolean(
//      s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.star WHERE user_name = ? AND goods_id = ?)",
//      List(
//        SqlParameter("String", userName),
//        SqlParameter("Int", goodsID.toString)
//      )
//    )
//
//    checkStarExists.flatMap { exists =>
//      if (!exists) {
//        IO.pure("Star record not found")
//      } else {
//        writeDB(
//          s"DELETE FROM ${schemaName}.star WHERE user_name = ? AND goods_id = ?",
//          List(
//            SqlParameter("String", userName),
//            SqlParameter("Int", goodsID.toString)
//          )
//        ).map { _ =>
//          s"Success: Star record for user '$userName' and goods ID '$goodsID' deleted successfully."
//        }
//      }
//    }
    for {
      _ <- writeDB(
        s"UPDATE ${schemaName}.goods_info SET star = star - 1 WHERE goods_id = ?",
        List(
          SqlParameter("Int", goodsID.toString)
        )
      )

      _ <- writeDB(
        s"DELETE FROM ${schemaName}.star WHERE user_name = ? AND goods_id = ?",
        List(
          SqlParameter("String", userName),
          SqlParameter("Int", goodsID.toString)
        )
      )
    } yield s"Success: Star record for user '$userName' and goods ID '$goodsID' deleted successfully."
  }
}
