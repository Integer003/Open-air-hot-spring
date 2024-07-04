// 定义和实现添加病人信息的逻辑
import { OperatorMessage } from 'Plugins/OperatorAPI/OperatorMessage'

export class AddUserMessage extends OperatorMessage{
    doctorName: string;
    patientName: string;

    constructor(doctorName:string, patientName:string) {
        super();
        this.doctorName = doctorName;
        this.patientName = patientName;
    }
}
