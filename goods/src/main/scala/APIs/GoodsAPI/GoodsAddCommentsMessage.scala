package APIs.GoodsAPI

case class GoodsAddCommentsMessage(goodsID: Int, senderName: String, content: String) extends GoodsMessage[String]
