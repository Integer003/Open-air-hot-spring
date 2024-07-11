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
  def init(config:ServerConfig):IO[Unit]=
    given PlanContext=PlanContext(traceID = TraceID(UUID.randomUUID().toString),0)
    for{
      _ <- API.init(config.maximumClientConnection)
      _ <- initSchema(schemaName)
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.user_name (user_name TEXT, password TEXT, money DECIMAL NOT NULL)", List())
//      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.operator_rec (operator_name TEXT, seller_name TEXT)", List())
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.cart (cart_id SERIAL PRIMARY KEY, user_name VARCHAR(255) NOT NULL, goods_id INT NOT NULL, time VARCHAR(255) NOT NULL, UNIQUE(user_name, goods_id))", List())
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.news (news_id SERIAL PRIMARY KEY, receiver VARCHAR(255) NOT NULL, receiver_type VARCHAR(255) NOT NULL, news_type VARCHAR(255) NOT NULL, news_time VARCHAR(255) NOT NULL, content TEXT, condition VARCHAR(255) NOT NULL) ", List())
    } yield ()

}
