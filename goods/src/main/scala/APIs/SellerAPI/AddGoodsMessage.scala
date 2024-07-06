package APIs.SellerAPI

case class AddSellerMessage(doctorName:String, patientName:String) extends SellerMessage[String]
