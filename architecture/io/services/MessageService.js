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

    async getChats(criteria = []) {
        return await this.factory.get('UserChat').get(criteria);
    }

    async send(message) {
        return await this.factory.get('Messages').create(message);
    }

    async createChat(chat) {
        return await this.factory.get('UserChat').create(chat);
    }

    async update(criteria = [], message) {
        return await this.factory.get('Messages').update(criteria, message);
    }

    async updateChat(criteria = [], chat) {
        return await this.factory.get('UserChat').update(criteria, chat);
    }

    async delete(criteria = []) {
        return await this.factory.get('Messages').remove(criteria);
    }
}