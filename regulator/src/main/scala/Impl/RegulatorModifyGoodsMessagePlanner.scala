// RegulatorModifyGoodsMessagePlanner.scala
package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.syntax.all.*
import io.circe.generic.auto.deriveEncoder

case class RegulatorModifyGoodsMessagePlanner(goodsID: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // 查询数据库中当前 goodsID 的 verify 值
    val selectQuery = "SELECT verify FROM goods.goods_info WHERE goods_id = ?"

    readDBString(selectQuery, List(SqlParameter("Int", goodsID))).flatMap { currentVerify =>
      // 计算新的 verify 值
      val newVerify = if (currentVerify == "true") "false" else "true"

      // 更新数据库中对应 goodsID 的 verify 值
      val updateQuery = "UPDATE goods.goods_info SET verify = ? WHERE goods_id = ?"

      writeDB(updateQuery, List(SqlParameter("String", newVerify), SqlParameter("Int", goodsID))).flatMap { updateResult =>
        if (updateResult.nonEmpty) {
          // 更新成功，返回成功信息
          IO.pure(s"Success: updated goods ID $goodsID verify to $newVerify.")
        } else {
          // 更新失败，返回错误信息
          IO.raiseError(new Exception(s"Failed to update verify for goods ID $goodsID."))
        }
      }
    }.handleErrorWith {
      // 错误处理
      case e: Throwable => IO.raiseError(new Exception(s"Error: ${e.getMessage}"))
    }
  }
}