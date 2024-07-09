package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

case class GoodsAddStarMessagePlanner(goodsID: Int, userName: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
//    val currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
//
//
//    // 插入一行新的 star 数据到 star 表
//    val query = s"INSERT INTO ${schemaName}.star (user_name, goods_id, time) VALUES (?, ?, ?)"
//
//    writeDB(
//      query,
//      List(
//        SqlParameter("String", userName),
//        SqlParameter("Int", goodsID.toString),
//        SqlParameter("String", currentTime)
//      )
//    ).map { _ =>
//      s"Success: Star added successfully for goods ID '$goodsID' and user '$userName'."
//    }
      for {
        _ <- writeDB(
          s"UPDATE ${schemaName}.goods_info SET star = star + 1 WHERE goods_id = ?",
          List(
            SqlParameter("Int", goodsID.toString)
          )
        )

        _ <- writeDB(
          s"INSERT INTO ${schemaName}.star (user_name, goods_id, time) VALUES (?, ?, ?)",
          List(
            SqlParameter("String", userName),
            SqlParameter("Int", goodsID.toString),
            SqlParameter("String", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
          )
        )
      } yield s"Success: Star added successfully for goods ID '$goodsID' and user '$userName'."
  }
