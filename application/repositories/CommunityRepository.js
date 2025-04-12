import supabase from "../../config/supabaseClient.js";
import {Repository} from "../../architecture/Repository.js";

/**
 * @implements {Repository}
 */
export class CommunityRepository extends Repository {
    async getAll() {
        return await this.execute(
                supabase.from('Communities')
                        .select('*')
        );
    }

    async get(id) {
        return await this.execute(
                supabase.from('Communities')
                        .select('*')
                        .eq('id', id)
        );
    }

    async create(parameters) {
        return await this.execute(
                supabase.from('Communities')
                        .insert([parameters])
                        .select('*')
        );
    }

    async remove(id) {
        return await this.execute(
                supabase.from('Communities')
                        .delete()
                        .eq('id', id)
                        .select('*')
        );
    }

    async update(parameters) {
        return await this.execute(
                supabase.from('Communities')
                        .update(parameters)
        );
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