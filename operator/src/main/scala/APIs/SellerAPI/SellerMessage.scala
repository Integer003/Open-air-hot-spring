package APIs.SellerAPI

import Common.API.API
import Global.ServiceCenter.sellerServiceCode
import io.circe.Decoder

abstract class SellerMessage[ReturnType:Decoder] extends API[ReturnType](sellerServiceCode)
