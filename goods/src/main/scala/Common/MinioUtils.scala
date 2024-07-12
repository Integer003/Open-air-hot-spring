// MinioUtils.scala
package Common

import io.minio.MinioClient
import io.minio.GetPresignedObjectUrlArgs
import io.minio.http.Method

object MinioUtils {

  val minioClient = MinioClient.builder()
    .endpoint("http://127.0.0.1:9000")
    .credentials("minioadmin", "minioadmin")
    .build()

  def generatePresignedUrl(bucketName: String, objectName: String, expiry: Int): String = {
    val presignedUrl = minioClient.getPresignedObjectUrl(
      GetPresignedObjectUrlArgs.builder()
        .method(Method.PUT)
        .bucket(bucketName)
        .`object`(objectName)
        .expiry(expiry)
        .build()
    )
    presignedUrl
  }
}
