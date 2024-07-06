package APIs.GoodsAPI

case class GoodsAddMessage(goodsName: String, price: BigDecimal, condition: String, sellerName: String) extends GoodsMessage[String]
