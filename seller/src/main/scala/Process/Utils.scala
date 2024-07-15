package Process

import Global.ServerConfig
import cats.effect.{IO, Resource}
import io.circe.generic.auto.*
import io.circe.parser.decode

import scala.io.{BufferedSource, Source}
import pdi.jwt.{Jwt, JwtAlgorithm, JwtClaim}

import java.time.Instant
import java.time.temporal.ChronoUnit
import scala.util.{Failure, Success}

object Utils {
  /** 读取config文件 */
  def readConfig(filePath: String): IO[ServerConfig] = {
    // Define a resource for managing the file
    val fileResource: Resource[IO, BufferedSource] = Resource.make {
      IO(Source.fromFile(filePath)) // Acquire the resource
    } { source =>
      IO(source.close()).handleErrorWith(_ => IO.unit) // Release the resource, ignoring errors on close
    }

    // Use the resource
    fileResource.use { source =>
      IO {
        val fileContents = source.getLines().mkString
        decode[ServerConfig](fileContents) match {
          case Right(config) => config
          case Left(error) => throw new RuntimeException(s"Failed to decode config: $error")
        }
      }
    }
  }

  val secretKey = "12349876" // 请使用安全的密钥

  def validateToken(token: String): Boolean = {
    Jwt.decode(token, secretKey, Seq(JwtAlgorithm.HS256)) match {
      case Success(_) => true
      case Failure(_) => false
    }
  }

  def createToken(userName: String): String = {
    val claim = JwtClaim(
      expiration = Some(Instant.now.plus(300, ChronoUnit.SECONDS).getEpochSecond), // token 有效期为 1 分钟
      issuedAt = Some(Instant.now.getEpochSecond),
      subject = Some(userName)
    )
    Jwt.encode(claim, secretKey, JwtAlgorithm.HS256)
  }

}

