package APIs.OperatorAPI

case class LoginMessage(userName:String, password:String) extends OperatorMessage[String]
