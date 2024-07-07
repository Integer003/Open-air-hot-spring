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
        IO(decode[AddSellerMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AddSellerMessage")))
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
      case "ShowTableMessage" =>
        IO(decode[ShowTableMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for ShowTableMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ClearTableMessage" =>
        IO(decode[ClearTableMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for ClearTableMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "SellerDeleteMessage" =>
        IO(decode[SellerDeleteMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerDeleteMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ShowRegulatorTableMessage" =>
        IO(decode[ShowRegulatorTableMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for ShowRegulatorTableMessage")))
          .flatMap{m=>
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
