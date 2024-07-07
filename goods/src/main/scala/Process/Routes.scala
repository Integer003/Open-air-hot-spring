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
    println(messageType)
    messageType match {
      case "GoodsAddMessage" =>
        IO(decode[GoodsAddMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GoodsAddMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GoodsBuyMessage" =>
        IO(decode[GoodsBuyMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GoodsBuyMessage")))
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
