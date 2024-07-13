// RegisterMessagePlanner.scala
package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import APIs.SellerAPI.SellerQueryMessage
import cats.effect.IO
import io.circe.generic.auto.*

// 把整个case class输给gpt，说按照这个格式实现什么具体的类似功能
case class RegisterMessagePlanner(userName: String, password: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // Check if the user is already registered
    val checkUserExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.user_name)",
        List()
      )

    checkUserExists.flatMap { exists =>
      if (exists) {
        IO.raiseError(new Exception("already registered"))
      } else {
        writeDB(s"INSERT INTO ${schemaName}.user_name (user_name, password) VALUES (?, ?)",
          List(SqlParameter("String", userName),
               SqlParameter("String", password)
          ))
      }
    }
  }

