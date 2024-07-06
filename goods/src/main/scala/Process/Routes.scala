package Process

import Common.API.PlanContext
import Impl.*
import cats.effect.*
import io.circe.generic.auto.*
import io.circe.parser.decode
import io.circe.syntax.*
import org.http4s.*
import org.http4s.client.Client
import org.http4s.dsl.io.*


object Routes:
  private def executePlan(messageType:String, str: String): IO[String]=
    messageType match {
      case "AddSellerMessage" =>
        IO(decode[AddSellerMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AddPatientMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "OperatorLoginMessage" =>
        IO(decode[LoginMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for LoginMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "OperatorRegisterMessage" =>
        IO(decode[RegisterMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for RegisterMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GoodsRegisterMessage" =>
        IO(decode[GoodsRegisterMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GoodsRegisterMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GoodsLoginMessage" =>
        IO(decode[GoodsLoginMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GoodsLoginMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GoodsSearchMessage" =>
        IO(decode[GoodsSearchMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GoodsSearchMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case _ =>
        IO.raiseError(new Exception(s"Unknown type: $messageType"))
    }

  val service: HttpRoutes[IO] = HttpRoutes.of[IO]:
    case req @ POST -> Root / "api" / name =>
        println("request received")
        req.as[String].flatMap{executePlan(name, _)}.flatMap(Ok(_))
        .handleErrorWith{e =>
          println(e)
          BadRequest(e.getMessage)
        }