import { SellerMessage } from 'Plugins/SellerAPI/SellerMessage'

export class AddNewsMessage extends SellerMessage {
    receiver: string;
    receiverType: string;
    newsType: string;
    content: string;
    constructor(receiver: string, receiverType: string, newsType: string, content: string) {
        super();
        this.receiver = receiver;
        this.newsType = newsType;
        this.content = content;
        this.receiverType = receiverType;
    }
}