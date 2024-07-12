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
import Common.MinioUtils // Add import for MinioUtils
import org.http4s.circe.CirceEntityEncoder._
import io.circe.syntax._

object Routes:
  private def executePlan(messageType: String, str: String): IO[String] =
    println(messageType)
    messageType match
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
      case "GoodsQueryCommentsMessage" =>
        IO(decode[GoodsQueryCommentsMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GoodsQueryCommentsMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GoodsAddCommentsMessage" =>
        IO(decode[GoodsAddCommentsMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GoodsAddCommentsMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GoodsDeleteCommentsMessage" =>
        IO(decode[GoodsDeleteCommentsMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GoodsDeleteCommentsMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GoodsAddStarMessage" =>
        IO(decode[GoodsAddStarMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GoodsAddStarMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GoodsQueryStarMessage" =>
        IO(decode[GoodsQueryStarMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GoodsQueryStarMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GoodsDeleteStarMessage" =>
        IO(decode[GoodsDeleteStarMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GoodsDeleteStarMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case _ =>
        IO.raiseError(new Exception(s"Unknown type: $messageType"))

  // Add the new route to handle generating the signed URL
  val service: HttpRoutes[IO] = HttpRoutes.of[IO]:
    case req @ POST -> Root / "api" / name =>
      println("request received")
      req.as[String].flatMap { executePlan(name, _) }.flatMap(Ok(_))
        .handleErrorWith { e =>
          println(e)
          BadRequest(e.getMessage)
        }
    case GET -> Root / "api" / "get-signed-url" :? BucketNameQueryParamMatcher(bucketName) +& ObjectNameQueryParamMatcher(objectName) =>
      val signedUrl = MinioUtils.generatePresignedUrl(bucketName, objectName, 3600) // 1 hour expiry
      Ok(Map("signedUrl" -> signedUrl).asJson)

  // Query parameter matchers
  object BucketNameQueryParamMatcher extends QueryParamDecoderMatcher[String]("bucketName")
  object ObjectNameQueryParamMatcher extends QueryParamDecoderMatcher[String]("objectName")
