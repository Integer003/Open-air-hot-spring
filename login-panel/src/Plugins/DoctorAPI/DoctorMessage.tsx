// 定义和实现医生消息的逻辑
import { API } from 'Plugins/CommonUtils/API'

export abstract class DoctorMessage extends API {
    override serviceName:string="Doctor"
}