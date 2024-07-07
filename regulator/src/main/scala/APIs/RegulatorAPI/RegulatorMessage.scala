package APIs.RegulatorAPI

import Common.API.API
import Global.ServiceCenter.{regulatorServiceCode, sellerServiceCode}
import io.circe.Decoder

abstract class RegulatorMessage[ReturnType:Decoder] extends API[ReturnType](regulatorServiceCode)
