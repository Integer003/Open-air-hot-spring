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
      case "SellerLoginMessage" =>
        IO(decode[SellerLoginMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerLoginMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "SellerQueryMessage" =>
        IO(decode[SellerQueryMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerQueryMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "SellerRegisterMessage" =>
        IO(decode[SellerRegisterMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerRegisterMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "SellerCancelMessage" =>
        IO(decode[SellerCancelMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerCancelMessage")))
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
