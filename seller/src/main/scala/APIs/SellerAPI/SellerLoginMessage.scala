package APIs.SellerAPI

case class SellerLoginMessage(userName:String, password:String) extends SellerMessage[String]
