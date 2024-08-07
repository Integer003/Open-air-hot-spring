package Common.API

import cats.effect.{IO, Resource}
import org.http4s.client.Client

import java.util.UUID

// Monad隐式参数可以不写。
trait Planner[ReturnType]:
  // using planContext：每次都要输入一次planContext很麻烦，自动猜填一个进去，不用写了。前提是环境里有这样一个planContext
  def plan(using planContext: PlanContext): IO[ReturnType]

  def fullPlan: IO[ReturnType] =
    IO.println(this) >> plan(using this.planContext)

  val planContext: PlanContext = PlanContext(TraceID(""), 0)
