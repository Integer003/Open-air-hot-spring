package Common.DBAPI

import Common.API.API
import Common.Object.ParameterList
import Global.ServiceCenter.dbManagerServiceCode

// 1000个写操作一起执行
case class WriteDBListMessage(sqlStatement: String, parameters: List[ParameterList]) extends API[String](dbManagerServiceCode)