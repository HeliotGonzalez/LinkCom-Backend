import {Service} from "./Service.js";

/**
 * @implements {Service}
 */
export class CommunityService extends Service {
    constructor(factory) {
        super(factory);
    }

    async create(parameters) {
        const creationResponse = await this.factory.get('Communities').create(parameters);
        await this.join(creationResponse.data.id, parameters.userID);
        if (parameters.interests) await this.factory.get('CommunityInterest').create(parameters);
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

    async join(communityID, userID, communityRole = 'creator') {
        return await this.factory.get('CommunityUser').create({communityID, userID, communityRole});
    }

    async leave(communityID, userID) {
        return await this.factory.get('CommunityUser').remove({communityID, userID});
    }

    async changeRole(communityRole, criteria = []) {
        return await this.factory.get('CommunityUser').update(communityRole, criteria);
    }

    async members(criteria = []) {
        return await this.factory.get('CommunityUser').get(criteria);
    }

    async excludingUser(criteria) {
        return this.factory.get('Communities').get(criteria)
    }
}