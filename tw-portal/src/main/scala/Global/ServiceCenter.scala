package Global

import Global.GlobalVariables.serviceCode
import cats.effect.IO
import com.comcast.ip4s.Port
import org.http4s.Uri

object ServiceCenter {
  val projectName: String = "APP"

  val dbManagerServiceCode = "A000001"
  val operatorServiceCode    = "A000002"
  val sellerServiceCode   = "A000003"
  val portalServiceCode    = "A000004"

  val fullNameMap: Map[String, String] = Map(
    dbManagerServiceCode ->  "数据库管理（DB_Manager）",
    operatorServiceCode    ->  "运营方（Operator）",
    sellerServiceCode   ->  "用户（Seller）",
    portalServiceCode    ->  "门户（Portal）"
  )

  val address: Map[String, String] = Map(
    "DB-Manager" ->     "127.0.0.1:10001",
    "Operator" ->         "127.0.0.1:10002",
    "Seller" ->        "127.0.0.1:10003",
    "Portal" ->         "127.0.0.1:10004"
  )
}

