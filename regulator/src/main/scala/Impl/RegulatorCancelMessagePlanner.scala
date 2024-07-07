// SellerCancelMessagePlanner.scala
// 实现删除Seller的功能
package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class RegulatorCancelMessagePlanner(userName: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // Check if the user exists
    val checkUserExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.user_name WHERE user_name = ?)",
      List(SqlParameter("String", userName))
    )

    checkUserExists.flatMap { exists =>
      if (exists) {
        // User exists, proceed to delete
        writeDB(s"DELETE FROM ${schemaName}.user_name WHERE user_name = ?",
          List(SqlParameter("String", userName))
        ).map(_ => "User successfully deleted")
      } else {
        // User does not exist, raise an error
        IO.raiseError(new Exception("User not found"))
      }
    }
  }