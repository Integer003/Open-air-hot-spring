import { SellerMessage } from 'Plugins/SellerAPI/SellerMessage'

export class ReadNewsMessage extends SellerMessage {
    newsID: string;
    constructor(newsID: string) {
        super();
        this.newsID = newsID;
    }
}