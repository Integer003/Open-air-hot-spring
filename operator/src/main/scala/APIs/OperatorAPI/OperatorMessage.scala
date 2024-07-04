package APIs.OperatorAPI

import Common.API.API
import Global.ServiceCenter.operatorServiceCode
import io.circe.Decoder

abstract class OperatorMessage[ReturnType:Decoder] extends API[ReturnType](operatorServiceCode)
