import {Service} from "./Service.js";
import { builderFactory } from "../../../application/utils/CiteriaUtils.js";

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

    async changeRole(criteria = [], parameters) {
        return await this.factory.get('CommunityUser').update(criteria, parameters);
    }

    async members(criteria = []) {
        return await this.factory.get('CommunityUser').get(criteria);
    }

    async announcements(criteria) {
        return await this.factory.get('Announcements').get(criteria);
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

    async getNonBelongingCommunities(userID, extraCriteria = []) {
        console.log('[CommunityService] getNonBelongingCommunities → userID:', userID);
    
        if (!userID) {
          return { success: false, error: 'userID requerido' };
        }
    
        const membershipsRes = await this.factory.get('CommunityUser').get([
          builderFactory.get('eq')('userID', userID).build()
        ]);
        if (!membershipsRes.success) return membershipsRes;
    
        const joinedIDs = (membershipsRes.data ?? []).map(m => m.communityID);
        console.log('[CommunityService] joinedIDs:', joinedIDs);
    
        const criteria = [
          ...extraCriteria,
          builderFactory.get('eq')('isPrivate', false).build()
        ];
        const commRes = await this.factory.get('Communities').get(criteria);
        if (!commRes.success) return commRes;
    
        const nonBelonging = commRes.data.filter(c => !joinedIDs.includes(c.id));
        console.log('[CommunityService] non-belonging result:', nonBelonging.length);
    
        return { success: true, data: nonBelonging };
    }


    /* ---------- PATCH con imagen ---------- */
    /*
    async update(criteria = [], parameters) {
        // 1. Si llega una nueva imagen en Base64 la persistimos
        if (parameters.imageBase64) {
        // Averiguamos el ID de la comunidad (viene en criterio 'eq id' o en los datos)
        let communityID =
            parameters.id ||
            (criteria.find(c => c.key === "id")?.value ?? null);

        if (!communityID) {
            const current = await this.factory.get("Communities").get(criteria);
            if (current.success && current.data.length) {
            communityID = current.data[0].id;
            // Borramos la vieja imagen (opcional)
            await removeImage(`../../images/communities/${communityID}/communityImage.png`);
            }
        }
        parameters.imagePath = await saveImage(
            parameters.imageBase64,
            `../../images/communities/${communityID}`
        );
        delete parameters.imageBase64;           // ya no hace falta
        }

        // 2. Actualizamos la fila
        return await this.factory.get("Communities").update(criteria, parameters);
    }
        */
}