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
      case "RegulatorLoginMessage" =>
        IO(decode[RegulatorLoginMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for PatientLoginMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "RegulatorQueryMessage" =>
        IO(decode[RegulatorQueryMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for PatientQueryMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "RegulatorRegisterMessage" =>
        IO(decode[RegulatorRegisterMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for PatientRegisterMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "RegulatorCancelMessage" =>
        IO(decode[RegulatorCancelMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerCancelMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "RegulatorQueryGoodsMessage" =>
        IO(decode[RegulatorQueryGoodsMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for RegulatorQueryGoodsMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "RegulatorModifyGoodsMessage" =>
        IO(decode[RegulatorModifyGoodsMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for RegulatorModifyGoodsMessage")))
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
