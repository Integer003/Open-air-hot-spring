package APIs.OperatorAPI

case class AddSellerMessage(operatorName:String, sellerName:String) extends OperatorMessage[String]
