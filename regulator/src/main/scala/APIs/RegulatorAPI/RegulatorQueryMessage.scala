package APIs.RegulatorAPI

case class RegulatorQueryMessage(operatorName:String, sellerName:String) extends RegulatorMessage[String]
