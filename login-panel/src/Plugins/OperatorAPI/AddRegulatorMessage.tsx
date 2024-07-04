// 定义和实现添加 Regulator 信息的逻辑
import { OperatorMessage } from 'Plugins/OperatorAPI/OperatorMessage'

export class AddRegulatorMessage extends OperatorMessage{
    operatorName: string;
    regulatorName: string;

    constructor(operatorName:string, regulatorName:string) {
        super();
        this.operatorName = operatorName;
        this.regulatorName = regulatorName;
    }
}