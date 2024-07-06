package APIs.OperatorAPI

case class AddSellerMessage(doctorName:String, patientName:String) extends OperatorMessage[String]
