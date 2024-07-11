package APIs.SellerAPI

case class SellerDeleteGoodsCartMessage(userName: String, goodsID: String) extends SellerMessage[String]
