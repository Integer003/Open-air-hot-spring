//package Impl
//
//import cats.effect.IO
//import io.circe.generic.auto.*
//import Common.API.{PlanContext, Planner}
//import Common.DBAPI.*
//import Common.Object.{ParameterList, SqlParameter}
//import Common.ServiceUtils.schemaName
//
//case class GoodsBuyMessagePlanner(buyerName: String, goodsID: String, override val planContext: PlanContext) extends Planner[String]:
//  override def plan(using planContext: PlanContext): IO[String] = {
////    startTransaction {
//      for {
//        // 更新 goods_info 表
//        _ <- writeDB(
//          s"UPDATE ${schemaName}.goods_info SET condition = 'true', buyer_name = ? WHERE goods_id = ?",
//          List(
//            SqlParameter("String", buyerName),
//            SqlParameter("Int", goodsID)
//          )
//        )
//
//        // 获取 goods_info 表中的 seller_name 和 price
//        goodsInfo <- readDBRows(
//          s"SELECT seller_name, price FROM ${schemaName}.goods_info WHERE goods_id = ?",
//          List(SqlParameter("Int", goodsID))
//        ).map(_.headOption)
//
//        // 确保数据存在
//
//        seller_name <- IO.fromOption(goodsInfo.flatMap(_.hcursor.get[String]("seller_name").toOption))(new Exception("Seller not found"))
//        price <- IO.fromOption(goodsInfo.flatMap(_.hcursor.get[Int]("price").toOption))(new Exception("Price not found"))
//
//        // 更新 seller 表中的 money
//        _ <- writeDB(
//          s"UPDATE seller.user_name SET money = money + ? WHERE user_name = ?",
//          List(
//            SqlParameter("Int", price.toString),
//            SqlParameter("String", seller_name)
//          )
//        )
//
//        // 更新 buyer 表中的 money
//        _ <- writeDB(
//          s"UPDATE seller.user_name SET money = money - ? WHERE user_name = ?",
//          List(
//            SqlParameter("Int", price.toString),
//            SqlParameter("String", buyerName)
//          )
//        )
//      } yield s"Success: Goods with ID '$goodsID' updated successfully and money transferred."
////    }
////    } handleErrorWith { error =>
////      for {
//////        _ <- rollback()
////      } yield s"Error: ${error.getMessage}"
//  }

package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName

case class GoodsBuyMessagePlanner(buyerName: String, goodsID: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    for {
      // 更新 goods_info 表
      _ <- writeDB(
        s"UPDATE ${schemaName}.goods_info SET condition = 'true', buyer_name = ? WHERE goods_id = ?",
        List(
          SqlParameter("String", buyerName),
          SqlParameter("Int", goodsID)
        )
      )

      // 获取 goods_info 表中的 seller_name 和 price
      goodsInfo <- readDBRows(
        s"SELECT seller_name, price FROM ${schemaName}.goods_info WHERE goods_id = ?",
        List(SqlParameter("Int", goodsID))
      ).map(_.headOption)

      // 确保数据存在
//      _ = println(s"*************goodsInfo: $goodsInfo") // 调试信息
// Strange! 直接读取数据库，应该是seller_name, 结果竟然是sellerName为名称！

      sellerName <- IO.fromOption(goodsInfo.flatMap(_.hcursor.get[String]("sellerName").toOption))(new Exception("Seller not found"))
      price <- IO.fromOption(goodsInfo.flatMap(_.hcursor.get[Int]("price").toOption))(new Exception("Price not found"))

      // 更新 seller 表中的 money
      _ <- writeDB(
        s"UPDATE seller.user_name SET money = money + ? WHERE user_name = ?",
        List(
          SqlParameter("Int", price.toString),
          SqlParameter("String", sellerName)
        )
      )

      // 更新 buyer 表中的 money
      _ <- writeDB(
        s"UPDATE seller.user_name SET money = money - ? WHERE user_name = ?",
        List(
          SqlParameter("Int", price.toString),
          SqlParameter("String", buyerName)
        )
      )
    } yield s"Success: Goods with ID '$goodsID' updated successfully and money transferred."
  }
