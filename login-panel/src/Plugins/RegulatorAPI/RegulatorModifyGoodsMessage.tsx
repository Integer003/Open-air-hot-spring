import { RegulatorMessage } from 'Plugins/RegulatorAPI/RegulatorMessage'

export class RegulatorModifyGoodsMessage extends RegulatorMessage {
    goodsID:string;
    constructor(goodsID:string) {
        super();
        this.goodsID = goodsID;
    }
}
