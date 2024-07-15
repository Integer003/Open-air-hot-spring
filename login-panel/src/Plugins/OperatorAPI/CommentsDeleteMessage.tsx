import { OperatorMessage } from 'Plugins/OperatorAPI/OperatorMessage'

export class CommentsDeleteMessage extends OperatorMessage{
    commentID: string;
    constructor(commentID : string) {
        super();
        this.commentID = commentID;
    }
}