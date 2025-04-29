import {Service} from "./Service.js";

/**
 * @implements {Service}
 */
export class EventService extends Service {

    constructor(factory) {
        super(factory);
    }

    async get(criteria = []) {
        return await this.factory.get('Events').get(criteria);
    }

    async join(parameters) {
        return await this.factory.get('EventUser').create(parameters);
    }

    async update(criteria = [], parameters) {
        return await this.factory.get('Events').update(criteria, parameters);
    }

    async leave(criteria = []) {
        return await this.factory.get('EventUser').remove(criteria);
    }

    async create(parameters) {
        return await this.factory.get('Events').create(parameters);
    }

    async remove(criteria = []) {
        return await this.factory.get('Events').remove(criteria);
    }

    async userEvents(criteria = []) {
        return await this.factory.get('EventUser').getWithJoin('Events', criteria);
    }

    async isJoined(criteria =[]) {
        const response = await this.factory.get('EventUser').get(criteria);
        response.data[0] = response.data.length > 0;
        return response;
    }

    async createComment(parameters) {
        return await  this.factory.get('Comments').create(parameters);
    }

    async getComments(criteria = []) {
        return await this.factory.get('Comments').get(criteria);
    }

}