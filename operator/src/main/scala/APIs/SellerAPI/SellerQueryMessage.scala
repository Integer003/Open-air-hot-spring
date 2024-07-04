package APIs.SellerAPI

case class SellerQueryMessage(doctorName:String, patientName:String) extends SellerMessage[String]
