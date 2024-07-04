// 定义和实现医生注册的逻辑
import { DoctorMessage } from 'Plugins/DoctorAPI/DoctorMessage'

export class RegisterMessage extends DoctorMessage {
    userName: string;
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
    }
}