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

    async join(communityID, eventID, userID) {
        return await this.factory.get('EventUser').create({communityID, eventID, userID});
    }

    async leave(criteria) {
        return await this.factory.get('EventUser').remove(criteria);
    }

    async create(parameters) {
        return await this.factory.get('Events').create(parameters);
    }

    async remove(criteria) {
        return await this.factory.get('Events').remove(criteria);
    }

    async userEvents(criteria) {
        return await this.factory.get('EventUser').getWithJoin('Events', criteria);
    }
}