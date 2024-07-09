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
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.goods_info (goods_id SERIAL PRIMARY KEY, goods_name VARCHAR(255) NOT NULL, price DECIMAL NOT NULL, description VARCHAR(255), condition VARCHAR(50), seller_name VARCHAR(255) NOT NULL, buyer_name VARCHAR(255), verify VARCHAR(255), comment TEXT, star DECIMAL NOT NULL)", List())
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.comments (comment_id SERIAL PRIMARY KEY, sender_name VARCHAR(255) NOT NULL, goods_id INT NOT NULL, time VARCHAR(255) NOT NULL, content TEXT NOT NULL)", List()) // 上一行最后一个反括号忘记加了，造成报错 ERROR: syntax error at end of the input
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.star (star_id SERIAL PRIMARY KEY, user_name VARCHAR(255) NOT NULL, goods_id INT NOT NULL, time VARCHAR(255) NOT NULL, UNIQUE(user_name, goods_id))", List()) // 发现过程：数据库是首先创建的，结果查看pgAdmin4发现根本没有创建，所以肯定是创建过程出了问题
    } yield ()
  }
}
