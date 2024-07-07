package APIs.GoodsAPI

case class GoodsBuyMessage(sellerName: String, goodsID: String) extends GoodsMessage[String]
