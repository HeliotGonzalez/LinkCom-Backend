import {Service} from "./Service.js";

/**
 * @implements Service
 */
export class NotificationService extends Service {
    constructor(factory) {
        super(factory);
    }

    async create(parameters) {
        return await this.factory.get('Notifications').create(parameters);
    }

    async get(criteria = []) {
        return await this.factory.get('Notifications').get(criteria);
    }

    async delete(criteria = []) {
        return await this.factory.get('Notifications').remove(criteria);
    }

    async update(criteria = [], parameters) {
        return await this.factory.get('Notifications').update(criteria, parameters);
    }
}