package APIs.GoodsAPI

import Common.API.API
import Global.ServiceCenter.goodsServiceCode
import io.circe.Decoder

abstract class GoodsMessage[ReturnType:Decoder] extends API[ReturnType](goodsServiceCode)
