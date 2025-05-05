import {Service} from "./Service.js";
import { builderFactory } from "../../../application/utils/CiteriaUtils.js";
import { getImage } from "../../../application/utils/imagesStore.js";

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
      console.log('⇨ UserService.profile, criteria:', criteria);
  
      // 1) Datos básicos
      const userRes = await this.factory.get('Users').get(criteria);
      if (!userRes.success) return { success: false, error: userRes.error };
      if (!userRes.data.length) return { success: false, error: 'User not found' };
      const userID = userRes.data[0].id;
  
      // 2) Intereses
      const intRes = await this.factory.get('UserInterest').get([
        builderFactory.get('eq')('userID', userID).build()
      ]);
      if (!intRes.success) return { success: false, error: intRes.error };
  
      // 3) Comunidades con JOIN
      const commRes = await this.factory.get('CommunityUser').getWithJoin(
        'Communities',
        [ builderFactory.get('eq')('userID', userID).build() ]
      );
      if (!commRes.success) return { success: false, error: commRes.error };
  
      // **3.1) Extraigo solo la parte Communities**
      const raws = commRes.data.map(cu => cu.Communities);
      console.log('[profile] raw communities:', raws);
  
      // **3.2) Convierto cada imagePath a Base64**
      const communities = await Promise.all(
        raws.map(async comm => {
          console.log('[profile] loading image for', comm.id, comm.imagePath);
          if (!comm.imagePath) return comm;
  
          let img;
          try {
            img = await getImage(`${comm.imagePath}/image.png`);
            console.log('[profile] got image for', comm.id);
          } catch (err) {
            console.error('[profile] error loading image for', comm.id, err);
          }
  
          return {
            ...comm,
            imagePath: img || comm.imagePath
          };
        })
      );
      console.log('[profile] communities with images:', communities);
  
      // 4) Eventos unidos
      const evJRes = await this.factory.get('EventUser').getWithJoin(
        'Events',
        [ builderFactory.get('eq')('userID', userID).build() ]
      );
      if (!evJRes.success) return { success: false, error: evJRes.error };
  
      // 5) Armo el perfil
      const profileData = {
        ...userRes.data[0],
        interests:  intRes.data.map(i => i.interest),
        communities,
        stats: {
          communities:  communities.length,
          eventsJoined: evJRes.data.length
        }
      };
  
      console.log('✓ profileData:', profileData);
      return { success: true, data: profileData };
    }
          
    async events(criteria = []) {
        return await this.factory.get('EventUser').getWithJoin('Events', criteria);
    }

    async addFriend(user1ID, user2ID) {
      return await this.factory.get('Friends').create({user1ID, user2ID});
    }

    /* Devuelve los amigos del usuario pasado por parámetro WIP */
    async getFriends(userID, criteria = []) {
      const friendsRes = await this.factory.get('Friends').get(criteria);
      if (!friendsRes.success) return { success: false, error: friendsRes.error };
  
      const friendIDs = friendsRes.data.map(row =>
          row.user1ID === userID ? row.user2ID : row.user1ID
      );
  
      if (!friendIDs.length) return { success: true, data: [] };
  
      const usersCriteria = [
          builderFactory.get('in')('id', friendIDs).build()
      ];
  
      const usersRes = await this.factory.get('Users').get(usersCriteria);
      if (!usersRes.success) return { success: false, error: usersRes.error };
  
      return { success: true, data: usersRes.data };
  }

    async makeFriendRequest(parameters) {
      const response = await this.factory.get('FriendRequests').create(parameters);
      console.log(response);
      return response;
    }

    async friendRequests(criteria = []) {
      const response = await this.factory.get('FriendRequests').get(criteria);
      console.log(response);
      return response;
    }

    async updateFriendRequest(criteria = [], parameters) {
      const response = await this.factory.get('FriendRequests').update(criteria, parameters);
      console.log(response);
      return response;
    }

    async cancelFriendRequest(criteria = []) {
      const response = await this.factory.get('FriendRequests').remove(criteria);
      console.log(response);
      return response;
    }

}