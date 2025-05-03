import {Service} from "./Service.js";
import { builderFactory } from "../../../application/utils/CiteriaUtils.js";
/**
 * @implements {Service}
 */
export class UserService extends Service {

    constructor(factory) {
        super(factory);
    }

    async get(criteria = [])  {
        return await this.factory.get('Users').get(criteria);
    }

    async communities(criteria = []) {
        return await this.factory.get('CommunityUser').getWithJoin('Communities', criteria);
    }

    async update(criteria = [], parameters) {
      return await this.factory.get('Users').update(criteria, parameters);
    }

    async profile(criteria) {
        console.log('   ⇨ UserService.profile, criteria:', criteria);

        // 1) Datos básicos del usuario
        const userRes = await this.factory.get('Users').get(criteria);
        const userID = userRes.data[0].id;

        if (!userRes.success) {
          return { success: false, error: userRes.error };
        }
        if (!Array.isArray(userRes.data) || userRes.data.length === 0) {
          return { success: false, error: `User ${userID} not found` };
        }
      
        // 2) Intereses
        const intRes = await this.factory.get('UserInterest').get([builderFactory.get('eq')('userID', userID).build() ]);
        if (!intRes.success) {
          return { success: false, error: intRes.error };
        }
      
        // 3) Comunidades (join a Communities)
        const commRes = await this.factory.get('CommunityUser').getWithJoin('Communities', [builderFactory.get('eq')('userID', userID).build()]);
        if (!commRes.success) {
          return { success: false, error: commRes.error };
        }
      
        // 4) Eventos unidos
        const evJRes = await this.factory.get('EventUser').getWithJoin('Events', [ builderFactory.get('eq')('userID', userID).build() ]);
        if (!evJRes.success) {
          return { success: false, error: evJRes.error };
        }
      
      
        // 6) Armar el objeto final
        const profileData = {
          ...userRes.data[0],
          interests: intRes.data.map(i => i.interest),
          communities: commRes.data.map(c => c.Communities),
          stats: {
            communities: commRes.data.length,
            eventsJoined: evJRes.data.length,
          },
        };
        console.log('   ✓ profileData assembled:', profileData);
      
        return {success: true, data: profileData};
    }
          

    async events(criteria = []) {
        return await this.factory.get('EventUser').getWithJoin('Events', criteria);
    }
}