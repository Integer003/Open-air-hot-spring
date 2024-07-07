package Process

import Common.API.{API, PlanContext, TraceID}
import Global.{ServerConfig, ServiceCenter}
import Common.DBAPI.{initSchema, writeDB}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*
import org.http4s.client.Client

import java.util.UUID

object Init {
  def init(config: ServerConfig): IO[Unit] = {
    given PlanContext = PlanContext(traceID = TraceID(UUID.randomUUID().toString), 0)
    for {
      _ <- API.init(config.maximumClientConnection)
      _ <- initSchema(schemaName)
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.goods_info (goods_id SERIAL PRIMARY KEY, goods_name VARCHAR(255) NOT NULL, price DECIMAL NOT NULL, description VARCHAR(255), condition VARCHAR(50), seller_name VARCHAR(255) NOT NULL, buyer_name VARCHAR(255), verify VARCHAR(255), comment TEXT)", List())
    } yield ()
  }
}
