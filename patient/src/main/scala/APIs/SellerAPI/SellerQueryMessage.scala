package APIs.SellerAPI

case class SellerQueryMessage(operatorName:String, sellerName:String) extends SellerMessage[String]
