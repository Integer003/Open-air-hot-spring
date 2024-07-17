package APIs.GoodsAPI

case class GoodsBuyCartMessage(buyerName: String, goodsIDList: List[String]) extends GoodsMessage[String]
