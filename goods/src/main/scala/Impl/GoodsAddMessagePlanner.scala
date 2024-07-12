// GoodsAddMessagePlanner.scala
package Impl

import cats.effect.IO
import io.circe.generic.auto._
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import Common.MinioUtils.generatePresignedUrl

case class GoodsAddMessagePlanner(goodsName: String, price: Int, description: String, condition: String, sellerName: String, imageUrl: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {

    // 插入商品信息到数据库
    writeDB(s"INSERT INTO ${schemaName}.goods_info (goods_name, price, description, condition, seller_name, verify, star, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      List(
        SqlParameter("String", goodsName),
        SqlParameter("Int", price.toString), // 确保类型一致
        SqlParameter("String", description),
        SqlParameter("String", condition),
        SqlParameter("String", sellerName),
        SqlParameter("String", "false"),
        SqlParameter("Int", 0.toString),
        SqlParameter("String", imageUrl)
      )
    ).map { _ =>
      s"Goods '$goodsName' added successfully."
    }
  }
}
