package APIs.SellerAPI

case class SellerAddGoodsCartMessage(userName: String, goodsID: String) extends SellerMessage[String]
