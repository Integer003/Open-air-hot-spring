package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{startTransaction, writeDB}
import cats.effect.IO
import io.circe.generic.auto.*

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{writeDB, *}
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import APIs.SellerAPI.SellerQueryMessage
import cats.effect.IO
import io.circe.generic.auto.*


case class AddSellerMessagePlanner(operatorName: String, sellerName: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    startTransaction {
      for {
        _ <- writeDB(s"INSERT INTO ${schemaName}.operator_seller (operator_name, seller_name) VALUES (?, ?)",
          List(SqlParameter("String", operatorName), SqlParameter("String", ""))
        )
        a <- SellerQueryMessage(operatorName, sellerName).send
      } yield "OK"
    }
  }
