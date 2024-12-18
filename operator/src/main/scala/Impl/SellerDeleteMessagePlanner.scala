package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName

case class SellerDeleteMessagePlanner(userName: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // Check if the user exists
    val checkUserExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM seller.user_name WHERE user_name = ?)",
      List(SqlParameter("String", userName))
    )

    checkUserExists.flatMap { exists =>
      if (!exists) {
        IO.raiseError(new Exception("user not found"))
      } else {
        writeDB(s"DELETE FROM seller.user_name WHERE user_name = ?",
          List(SqlParameter("String", userName))
        ).map { _ =>
          s"Success: Seller with userName: $userName deleted successfully."
        }
      }
    }
  }
