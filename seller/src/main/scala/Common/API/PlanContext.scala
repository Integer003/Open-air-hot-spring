package Common.API
// traceID使用同一个ID，transactionLevel层数
case class PlanContext(traceID:TraceID, transactionLevel: Int)
