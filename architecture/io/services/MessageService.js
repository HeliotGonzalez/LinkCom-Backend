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
        return await this.factory.get('Messages').create(message);
    }

    async update(criteria = [], message) {
        return await this.factory.get('Messages').update(criteria, message);
    }

    async delete(criteria = []) {
        return this.factory.get('Messages').delete(criteria);
    }
}