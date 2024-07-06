package APIs.GoodsAPI

case class GoodsLoginMessage(doctorName:String, patientName:String) extends GoodsMessage[String]
