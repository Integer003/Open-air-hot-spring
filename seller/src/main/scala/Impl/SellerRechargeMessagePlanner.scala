package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class SellerRechargeMessagePlanner(userName: String, money: BigDecimal, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // 查询数据库中当前 userName 的 money 值
    val selectQuery = "SELECT money FROM seller.user_name WHERE user_name = ?"

    readDBString(selectQuery, List(SqlParameter("String", userName))).flatMap { currentMoneyStr =>
      // 计算新的 money 值
      val currentMoney = BigDecimal(currentMoneyStr)
      val newMoney = currentMoney + money

      // 更新数据库中对应 userName 的 money 值
      val updateQuery = "UPDATE seller.user_name SET money = ? WHERE user_name = ?"

      writeDB(updateQuery, List(SqlParameter("Int", newMoney.toString()), SqlParameter("String", userName))).flatMap { updateResult =>
        if (updateResult.nonEmpty) {
          // 更新成功，返回成功信息
          IO.pure(s"Success: updated user $userName money to $newMoney.")
        } else {
          // 更新失败，返回错误信息
          IO.raiseError(new Exception(s"Failed to update money for user $userName."))
        }
      }
    }.handleErrorWith {
      // 错误处理
      case e: Throwable => IO.raiseError(new Exception(s"Error: ${e.getMessage}"))
    }
  }
}

