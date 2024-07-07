import { RegulatorMessage } from 'Plugins/RegulatorAPI/RegulatorMessage'

export class RegulatorCancelMessage extends RegulatorMessage {
    userName: string;

    constructor(userName: string) {
        super();
        this.userName = userName;
    }
}