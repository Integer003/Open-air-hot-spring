package APIs.OperatorAPI

case class ClearTableMessage(operatorName:String, sellerName:String) extends OperatorMessage[String]
