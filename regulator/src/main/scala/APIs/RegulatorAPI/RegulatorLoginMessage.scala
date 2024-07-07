package APIs.RegulatorAPI

case class RegulatorLoginMessage(userName:String, password:String) extends RegulatorMessage[String]
