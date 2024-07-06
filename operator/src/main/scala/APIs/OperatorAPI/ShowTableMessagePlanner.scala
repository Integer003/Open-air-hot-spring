package APIs.OperatorAPI

case class ShowTableMessagePlanner(operatorName:String, sellerName:String) extends OperatorMessage[String]