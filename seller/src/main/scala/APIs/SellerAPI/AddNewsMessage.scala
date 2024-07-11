package APIs.SellerAPI

case class AddNewsMessage(receiver: String, receiverType: String, newsType: String, content: String) extends SellerMessage[String]

