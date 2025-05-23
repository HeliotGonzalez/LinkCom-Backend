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

    async create(parameters, interests) {
        const creationResponse = await this.factory.get('Events').create(parameters);
        if (creationResponse.success && interests) {
            for (const i of interests) {
                const res = await this.factory.get('EventInterest').create({
                    'eventID': creationResponse.data[0].id,
                    'interest': i
                });
                console.log(res);
            }
        }
        return creationResponse
    }

    async remove(criteria) {
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

    async members(criteria = []) {
        return await this.factory.get('EventUser').get(criteria);
    }

}