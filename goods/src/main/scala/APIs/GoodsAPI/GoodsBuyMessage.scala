package APIs.GoodsAPI

case class GoodsBuyMessage(buyerName: String, goodsID: String) extends GoodsMessage[String]
