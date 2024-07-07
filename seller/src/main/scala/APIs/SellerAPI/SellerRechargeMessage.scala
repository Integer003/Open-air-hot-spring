package APIs.SellerAPI

case class SellerRechargeMessage(userName: String, money: BigDecimal) extends SellerMessage[String]
