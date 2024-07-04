// 定义和实现 Operator 注册的逻辑
import { OperatorMessage } from 'Plugins/OperatorAPI/OperatorMessage'

export class OperatorRegisterMessage extends OperatorMessage {
    userName: string;
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
    }
}