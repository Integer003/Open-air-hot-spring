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
import pdi.jwt.JwtAlgorithm
import org.http4s.implicits._
import org.http4s.headers.Authorization
import org.http4s.syntax.all._
import org.http4s.syntax.header._
import org.http4s.headers.{Authorization, `WWW-Authenticate`}
import org.http4s.{AuthScheme, Challenge, Credentials, Request, Response, HttpRoutes}
import org.http4s.dsl.io._
import org.http4s.circe._

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
          .flatMap { m =>
            m.fullPlan.map {
              case Left(errorMessage) => Map("message" -> errorMessage).asJson.noSpaces
              case Right(userName) => Map("message" -> "Valid Seller", "userName" -> userName).asJson.noSpaces
            }
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
      case "RegulatorDeleteMessage" =>
        IO(decode[RegulatorDeleteMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for RegulatorDeleteMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ShowGoodsTableMessage" =>
        IO(decode[ShowGoodsTableMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for ShowGoodsTableMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GoodsDeleteMessage" =>
        IO(decode[GoodsDeleteMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GoodsDeleteMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ShowCommentsTableMessage" =>
        IO(decode[ShowCommentsTableMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for ShowCommentTableMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "CommentsDeleteMessage" =>
        IO(decode[CommentsDeleteMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for CommentDeleteMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }

      case _ =>
        IO.raiseError(new Exception(s"Unknown type: $messageType"))
    }

  private def validateAndExecute(req: Request[IO], name: String): IO[Response[IO]] = {
    println(s"Headers: $req.headers")
    req.headers.get[headers.Authorization] match {
      case Some(authHeader) =>
        println(authHeader)
        val token = authHeader.value.split(" ")(1)
        if (Utils.validateToken(token)) {
          req.as[String].flatMap(executePlan(name, _)).flatMap(Ok(_))
            .handleErrorWith { e =>
              println(e)
              BadRequest(e.getMessage)
            }
        } else {
          Forbidden("Invalid token")
        }
      case None =>
        val challenge = `WWW-Authenticate`(Challenge(scheme = AuthScheme.Bearer.toString, realm = "example"))
        IO.pure(Response[IO](Status.Unauthorized).putHeaders(challenge))
    }
  }

  val service: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case req@POST -> Root / "api" / name if name == "OperatorRegisterMessage" =>
      req.as[String].flatMap { str =>
        executePlan(name, str).flatMap(Ok(_))
      }.handleErrorWith { e =>
        println(e)
        BadRequest(e.getMessage)
      }

    case req@POST -> Root / "api" / name if name == "OperatorLoginMessage" =>
      req.as[String].flatMap { str =>
        executePlan(name, str).flatMap { result =>
          val decodedResult = decode[Map[String, String]](result).getOrElse(Map("message" -> "Error decoding result"))
          val token = decodedResult.get("userName") match {
            case Some(userName) => Utils.createToken(userName)
            case None => Utils.createToken("InvalidUser")
          }
          Ok(decodedResult.asJson.deepMerge(Map("token" -> token.asJson).asJson))
        }
      }.handleErrorWith { e =>
        println(e)
        BadRequest(e.getMessage)
      }

    case req@POST -> Root / "api" / name =>
      validateAndExecute(req, name)
  }
