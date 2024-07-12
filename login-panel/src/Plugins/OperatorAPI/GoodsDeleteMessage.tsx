import { OperatorMessage } from 'Plugins/OperatorAPI/OperatorMessage'

export class GoodsDeleteMessage extends OperatorMessage{
    goodsID: string;
    constructor(goodsID : string) {
        super();
        this.goodsID = goodsID;
    }
}