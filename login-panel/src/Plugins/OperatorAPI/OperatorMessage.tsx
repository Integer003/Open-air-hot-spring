// 定义和实现 Operator 消息的逻辑
import { API } from 'Plugins/CommonUtils/API'

export abstract class OperatorMessage extends API {
    override serviceName:string="Operator"
}