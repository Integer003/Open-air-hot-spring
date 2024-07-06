package Global

import Global.GlobalVariables.serviceCode
import cats.effect.IO
import com.comcast.ip4s.Port
import org.http4s.Uri

object ServiceCenter {
  val projectName: String = "APP"

  val dbManagerServiceCode = "A000001"
  val operatorServiceCode  = "A000002"
  val sellerServiceCode    = "A000003"
  val portalServiceCode    = "A000004"
  val regulatorServiceCode = "A000005"
  val goodsServiceCode     = "A000006"

  val fullNameMap: Map[String, String] = Map(
    dbManagerServiceCode ->  "数据库管理（DB_Manager）",
    operatorServiceCode  ->  "运营方（Operator）",
    sellerServiceCode    ->  "用户（Seller）",
    portalServiceCode    ->  "门户（Portal）",
    regulatorServiceCode ->  "监管方（Regulator）",
    goodsServiceCode     ->  "商品（Goods）"
  )

  val address: Map[String, String] = Map(
    "DB-Manager" ->     "127.0.0.1:10001",
    "Operator"   ->     "127.0.0.1:10002",
    "Seller"     ->     "127.0.0.1:10003",
    "Portal"     ->     "127.0.0.1:10004",
    "Regulator"  ->     "127.0.0.1:10005",
    "Goods"      ->     "127.0.0.1:10006"
  )

  def getURI(serviceCode: String): IO[Uri] =
    IO.fromEither(Uri.fromString(
      "http://localhost:" + getPort(serviceCode).value.toString + "/"
    ))

  def getPort(serviceCode: String): Port =
    Port.fromInt(portMap(serviceCode)).getOrElse(
      throw new IllegalArgumentException(s"Invalid port for serviceCode: $serviceCode")
    )


  def serviceName(serviceCode: String): String = {
    val fullName = fullNameMap(serviceCode)
    val start = fullName.indexOf("（")
    val end = fullName.indexOf("）")
    fullNameMap(serviceCode).substring(start + 1, end).toLowerCase
  }

  def portMap(serviceCode: String): Int = {
    serviceCode.drop(1).toInt +
      (if (serviceCode.head == 'A') 10000 else if (serviceCode.head == 'D') 20000 else 30000)
  }


  lazy val servicePort: Int = portMap(serviceCode)
  lazy val serviceFullName: String = fullNameMap(serviceCode)
  lazy val serviceShortName: String = serviceName(serviceCode)
  lazy val schemaName: String = serviceName(serviceCode)
}
