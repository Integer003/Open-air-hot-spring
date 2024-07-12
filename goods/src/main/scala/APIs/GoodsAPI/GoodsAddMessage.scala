// GoodsAddMessage.scala
package APIs.GoodsAPI

case class GoodsAddMessage(goodsName: String, price: BigDecimal, condition: String, sellerName: String, imageUrl: String) extends GoodsMessage[String]
