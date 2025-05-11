import {Service} from "./Service.js";

/**
 * @implements Service
 */
export class MessageService extends Service {
    constructor(factory) {
        super(factory);
    }

    async get(criteria = []) {
        return await this.factory.get('Messages').get(criteria);
    }

    async send(message) {
        const res = await this.factory.get('Messages').create(message);
        console.log(res)
        return res;
    }

    async update(criteria = [], message) {
        return await this.factory.get('Messages').update(criteria, message);
    }

    async delete(criteria = []) {
        const res = await this.factory.get('Messages').remove(criteria);
        console.log(res)
        return res;
    }
}