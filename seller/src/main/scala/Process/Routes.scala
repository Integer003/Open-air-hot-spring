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
      case "SellerLoginMessage" =>
        IO(decode[SellerLoginMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerLoginMessage")))
          .flatMap { m =>
            m.fullPlan.map {
              case Left(errorMessage) => Map("message" -> errorMessage).asJson.noSpaces
              case Right(userName) => Map("message" -> "Valid Seller", "userName" -> userName).asJson.noSpaces
            }
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
      case "SellerQueryGoodsMessage" =>
        IO(decode[SellerQueryGoodsMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerQueryGoodsMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "SellerQueryStorageMessage" =>
        IO(decode[SellerQueryStorageMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerQueryStorageMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "SellerQueryRecordMessage" =>
        IO(decode[SellerQueryRecordMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerQueryRecordMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
//      case "SellerCancelGoodsMessage" =>
//        IO(decode[SellerCancelGoodsMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerCancelGoodsMessage")))
//          .flatMap{m=>
//            m.fullPlan.map(_.asJson.toString)
//          }
      case "SellerCancelGoodsMessage" =>
        IO(decode[SellerCancelGoodsMessagePlanner](str)).flatMap {
          case Right(m) =>
            m.fullPlan.map(_.asJson.toString)
          case Left(error) =>
            IO.raiseError(new Exception(s"Invalid JSON for SellerCancelGoodsMessage: ${error.getMessage}"))
        }
      case "SellerQueryMoneyMessage" =>
        IO(decode[SellerQueryMoneyMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerQueryMoneyMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "SellerRechargeMessage" =>
        IO(decode[SellerRechargeMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerRechargeMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "SellerQueryGoodsIsStarredMessage" =>
        IO(decode[SellerQueryGoodsIsStarredMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerQueryGoodsIsStarredMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "SellerQueryGoodsIsCartMessage" =>
        IO(decode[SellerQueryGoodsIsCartMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerQueryGoodsIsCartMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "SellerDeleteGoodsCartMessage" =>
        IO(decode[SellerDeleteGoodsCartMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerDeleteGoodsCartMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AddNewsMessage" =>
        IO(decode[AddNewsMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SellerAddNewsMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "SellerAddGoodsCartMessage" =>
        IO(decode[SellerAddGoodsCartMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AddGoodsCartMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "QueryNewsMessage" =>
        IO(decode[QueryNewsMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for QueryNewsMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReadNewsMessage" =>
        IO(decode[ReadNewsMessagePlanner](str)).flatMap {
          case Right(m) =>
            m.fullPlan.map(_.asJson.toString)
          case Left(error) =>
            IO.raiseError(new Exception(s"Invalid JSON for ReadNewsMessage: ${error.getMessage}"))
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
    case req @ POST -> Root / "api" / name if name == "SellerRegisterMessage" =>
      req.as[String].flatMap { str =>
        executePlan(name, str).flatMap(Ok(_))
      }.handleErrorWith { e =>
        println(e)
        BadRequest(e.getMessage)
      }

    case req @ POST -> Root / "api" / name if name == "SellerLoginMessage" =>
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

    case req @ POST -> Root / "api" / name =>
      validateAndExecute(req, name)
  }
