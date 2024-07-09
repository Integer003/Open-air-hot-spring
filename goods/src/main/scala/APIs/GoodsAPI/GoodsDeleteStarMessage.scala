package APIs.GoodsAPI

case class GoodsDeleteStarMessage(goodsID: Int, userName: String) extends GoodsMessage[String]
