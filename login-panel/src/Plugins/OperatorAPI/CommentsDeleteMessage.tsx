import { OperatorMessage } from 'Plugins/OperatorAPI/OperatorMessage'

export class CommentsDeleteMessage extends OperatorMessage{
    commentsID: string;
    constructor(commentsID : string) {
        super();
        this.commentsID = commentsID;
    }
}