// 定义和实现添加 User 信息的逻辑
import { OperatorMessage } from 'Plugins/OperatorAPI/OperatorMessage'

export class AddUserMessage extends OperatorMessage{
    operatorName: string;
    userName: string;

    constructor(operatorName:string, userName:string) {
        super();
        this.operatorName = operatorName;
        this.userName = userName;
    }
}

