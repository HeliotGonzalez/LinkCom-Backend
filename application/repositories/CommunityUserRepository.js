import supabase from "../../config/supabaseClient.js";
import {Repository} from "../../architecture/Repository.js";

/**
 * @implements {Repository}
 */
export class CommunityUserRepository extends Repository {
    async getAll() {
        return await this.execute(
                supabase.from('CommunityUser')
                        .select('*')
        );
    }

    async get(id) {
        return await this.execute(
                supabase.from('CommunityUser')
                        .select('*')
                        .eq('communityID', id)
        );
    }

    async create(parameters) {
        return await this.execute(
                supabase.from('CommunityUser')
                        .insert([parameters])
                        .select('*')
        );
    }

    async remove(communityID, userID) {
        return await this.execute(
                supabase.from('CommunityUser')
                        .delete()
                        .eq('communityID', communityID)
                        .eq('userID', userID)
                        .select('*')
        );
    }

    async update() {
        throw new Error('Method not implemented');
    }

    async execute(query) {
        const {data, error} = await query;

        if (error) {
            console.error('Error en Supabase:', error.message);
            return {success: false, error: error.message};
        }

        return {success: true, data};
    };
}