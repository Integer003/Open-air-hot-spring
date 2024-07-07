// SellerQueryMoneyMessagePlanner.scala
package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import io.circe.syntax.*
import io.circe.{Decoder, Encoder, HCursor, Json}
import cats.syntax.all.*

case class MoneyInfo(money: BigDecimal)

object MoneyInfo {
  implicit val decoder: Decoder[MoneyInfo] = new Decoder[MoneyInfo] {
    final def apply(c: HCursor): Decoder.Result[MoneyInfo] =
      for {
        money <- c.downField("money").as[BigDecimal]
      } yield MoneyInfo(money)
  }
}

case class SellerQueryMoneyMessagePlanner(sellerName: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // Query seller.user_name for entries where user_name equals the provided sellerName
    val query = s"SELECT money FROM ${schemaName}.user_name WHERE user_name = ?"

    readDBRows(query, List(SqlParameter("String", sellerName))).flatMap { rows =>
      // 调试输出查询结果
      IO {
        println(rows)
        rows
      }.flatMap { rows =>
        // Decode rows to MoneyInfo and then convert to JSON string
        IO.fromEither(rows.traverse(row => row.as[MoneyInfo])).map { moneyInfoList =>
          moneyInfoList.headOption.map(_.money.asJson.noSpaces).getOrElse("No money data found")
        }
      }
    }
  }
}

