package APIs.GoodsAPI

case class GoodsAddStarMessage(goodsID: Int, userName: String) extends GoodsMessage[String]
