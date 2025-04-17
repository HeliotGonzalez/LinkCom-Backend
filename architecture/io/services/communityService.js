import {Service} from "./Service.js";

/**
 * @implements {Service}
 */
export class CommunityService extends Service {
    constructor(factory) {
        super(factory);
    }

    async create(parameters, interests) {
        const creationResponse = await this.factory.get('Communities').create(parameters);
        if (creationResponse.success) await this.join(creationResponse.data.id, parameters.userID);
        if (creationResponse.success && interests) await this.factory.get('CommunityInterest').create(parameters);
        return creationResponse;
    }

    async get(criteria = []) {
        return await this.factory.get('Communities').get(criteria);
    }

    async update(criteria = [], parameters) {
        return await this.factory.get('Communities').update(criteria, parameters);
    }

    async remove(criteria = []) {
        return await this.factory.get('Communities').remove(criteria);
    }

    async join(communityID, userID, communityRole = 'administrator') {
        return await this.factory.get('CommunityUser').create({communityID, userID, communityRole});
    }

    async leave(criteria) {
        return await this.factory.get('CommunityUser').remove(criteria);
    }

    async changeRole(communityRole, criteria = []) {
        return await this.factory.get('CommunityUser').update(communityRole, criteria);
    }

    async members(criteria = []) {
        return await this.factory.get('CommunityUser').get(criteria);
    }

    async announcements(criteria) {
        return this.factory.get('Announcements').get(criteria);
    }

    async events(criteria) {
        return this.factory.get('Events').get(criteria);
    }
}