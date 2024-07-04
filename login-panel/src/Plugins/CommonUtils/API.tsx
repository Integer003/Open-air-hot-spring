// 定义和实现一些API调用的逻辑，提供给应用其他部分使用
// Define the message classes with toJson methods
import { stringify } from 'jsonfile/utils'

export abstract class API {
    serviceName:string
    public readonly type = this.getName()
    public getURL():string {
        return "http://127.0.0.1:10004/api/"+this.serviceName+"/"+this.type
    }

    private getName() {
        return this.constructor.name
    }
}
