package APIs.SellerAPI

case class QueryNewsMessage(receiver: String, receiverType: String)  extends SellerMessage[String]
