package APIs.GoodsAPI

case class GoodsQueryMessage(operatorName:String, sellerName:String) extends GoodsMessage[String]
