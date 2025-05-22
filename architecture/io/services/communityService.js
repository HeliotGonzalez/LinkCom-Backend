import {Service} from "./Service.js";
import {builderFactory} from "../../../application/utils/CiteriaUtils.js";
import {saveImage} from "../../../application/utils/imagesStore.js";

/**
 * @implements {Service}
 */
export class CommunityService extends Service {
    constructor(factory) {
        super(factory);
    }

    async create(parameters, interests) {
        const creationResponse = await this.factory.get('Communities').create(parameters);
        if (creationResponse.success) await this.join(creationResponse.data[0].id, parameters.creatorID);
        if (creationResponse.success && interests) {
            for (const i of interests) {
                const res = await this.factory.get('CommunityInterest').create({
                    'communityID': creationResponse.data[0].id,
                    'interest': i
                });
                console.log(res);
            }
        }
        return creationResponse;
    }

    async get(criteria = []) {
        return await this.factory.get('Communities').get(criteria);
    }

    async update(criteria = [], parameters) {
        return await this.factory.get('Communities').update(criteria, parameters);
    }

    async updateWithImage(id, parameters) {
        const updateResponse = await this.factory.get('Communities').update([builderFactory.get('eq')('id', id).build()],parameters);
    
        if (updateResponse.success && parameters.imagePath) {
          const folder = `../../images/communities/${id}`;
          const newImagePath = await saveImage(parameters.imagePath, folder);
          await this.factory.get('Communities').update([builderFactory.get('eq')('id', id).build()],{ imagePath: newImagePath });
        }
        return updateResponse;
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

    async changeRole(criteria = [], parameters) {
        return await this.factory.get('CommunityUser').update(criteria, parameters);
    }

    async members(criteria = []) {
        return await this.factory.get('CommunityUser').get(criteria);
    }

    async announcements(criteria) {
        return await this.factory.get('Announcements').get(criteria);
    }

    async createAnnouncement(parammeters) {
        return await this.factory.get('Announcements').create(parammeters);
    }

    async events(criteria) {
        return await this.factory.get('Events').get(criteria);
    }

    async makeRequest(parameters) {
        return await this.factory.get('JoinRequests').create(parameters);
    }

    async joinRequests(criteria = []) {
        return await this.factory.get('JoinRequests').get(criteria);
    }

    async updateJoinRequest(criteria = [], parameters) {
        return await this.factory.get('JoinRequests').update(criteria, parameters);
    }

    async cancelRequest(criteria = []) {
        return await this.factory.get('JoinRequests').remove(criteria);
    }

    async isJoined(criteria = []) {
        const response = this.get(criteria);
        response.data[0] = response.data.length > 0;
        return response;
    }

    async getNonBelongingCommunities(userID, extraCriteria = []) {
        if (!userID) {
          return { success: false, error: 'userID requerido' };
        }
    
        const membershipsRes = await this.factory.get('CommunityUser').get([
          builderFactory.get('eq')('userID', userID).build()
        ]);
        if (!membershipsRes.success) return membershipsRes;
    
        const joinedIDs = (membershipsRes.data ?? []).map(m => m.communityID);
    
        const criteria = [
          ...extraCriteria,
          builderFactory.get('eq')('isPrivate', false).build(),
          builderFactory.get('eq')('isPrivate', false).build()
        ];
        const commRes = await this.factory.get('Communities').get(criteria);
        if (!commRes.success) return commRes;
    
        const nonBelonging = commRes.data.filter(c => !joinedIDs.includes(c.id));
    
        return { success: true, data: nonBelonging };
    }

    async deleteAnnouncement(criteria = []) {
        return await this.factory.get("Announcements").remove(criteria);
    }

}