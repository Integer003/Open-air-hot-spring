ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := "3.4.0"

lazy val root = (project in file("."))
  .settings(
    name := "Operator"
  )

val http4sVersion = "1.0.0-M40"
val circeVersion = "0.14.6"

libraryDependencies ++= Seq(
  "org.http4s" %% "http4s-dsl" % http4sVersion,
  "org.http4s" %% "http4s-ember-server" % http4sVersion,
  "org.http4s" %% "http4s-ember-client" % http4sVersion,
  "org.http4s" %% "http4s-circe" % http4sVersion,
  "org.typelevel" %% "log4cats-slf4j" % "2.6.0",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "org.typelevel" %% "log4cats-core"    % "2.3.1",
  "org.typelevel" %% "log4cats-slf4j"   % "2.3.1",
  "org.apache.pdfbox" % "pdfbox" % "2.0.24",
  "ch.qos.logback" % "logback-classic" % "1.2.10",
  "joda-time" % "joda-time" % "2.12.7",
  // 添加 pdi.jwt 依赖
  //  "com.pauldijou" %% "jwt-core" % "5.0.0",
)
scalacOptions ++= Seq("-feature", "-language:implicitConversions")

libraryDependencies += "com.pauldijou" %% "jwt-core" % "5.0.0" cross CrossVersion.for3Use2_13