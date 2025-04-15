// application/services/communityUserService.js
import { Service } from "../../architecture/model/Service.js";

/**
 * @implements {Service}
 */
export class CommunityUserService extends Service {
    constructor(repository) {
        super();
        this._repository = repository;
    }

    repository() {
        return this._repository;
    }

    /**
     * Método para que un usuario se una a una comunidad.
     * Agrega la fecha de creación y asigna el rol "member".
     * @param {Object} data - Objeto que debe contener userID y communityID.
     * @returns {Promise<Object>} - Resultado con { success, data } o { success, error }.
     */
    async join(data) {
        const { userID, communityID } = data;
        if (!userID || !communityID) {
            return { success: false, error: 'userID y communityID son requeridos' };
        }
        const created_at = new Date().toISOString();
        const communityRole = 'member';
        const dataToInsert = { userID, communityID, created_at, communityRole };
        return await this._repository.create(dataToInsert);
    }

    /**
     * Permite que un usuario se una a una comunidad utilizando el método join.
     * @param {Object} data - Objeto que debe contener userID y communityID.
     * @returns {Promise<Object>}
     */
    async joinCommunity(data) {
        return await this.join(data);
    }

    async members(query) {
        return await this._repository.get(query);
    }

    async changeRole(query, parameters) {
        return await this._repository.update(query, parameters);
    }

    async leave(query) {
        return await this._repository.remove(query);
    }
}
