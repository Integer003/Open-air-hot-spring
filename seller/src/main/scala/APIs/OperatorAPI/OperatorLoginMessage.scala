package APIs.OperatorAPI

case class OperatorLoginMessage(userName:String, password:String) extends OperatorMessage[String]
