import supabase from "../../../config/supabaseClient.js";
import {Repository} from "../../../architecture/io/repositories/Repository.js";

/**
 * @implements {Repository}
 */
export class SupabaseRepository extends Repository {
    constructor(table) {
        super();
        this.table = table;
    }

    async create(parameters) {
        return await this.execute(
            supabase.from(this.table)
                .insert([parameters])
                .select('*')
        );
    }

    async get(criteria) {
        return await this.execute(
            this.applyCriteria(
                supabase.from(this.table)
                    .select('*'),
                criteria
            ).select('*')
        );
    }

    async getWithJoin(join, criteria) {
        const result = await this.execute(
            this.applyCriteria(
                supabase.from(this.table)
                    .select(`*, ${join}(*)`),
                criteria
            )
        );
        if (result.success) result.data = result.data.filter(e => e[join]);
        return result;
    }

    async update(criteria, parameters) {
        return await this.execute(
            this.applyCriteria(
                supabase.from(this.table)
                    .update(parameters),
                criteria
            ).select('*')
        );
    }

    async remove(criteria) {
        return await this.execute(
            this.applyCriteria(
                supabase.from(this.table)
                    .delete(),
                criteria
            ).select('*')
        );
    }

    async execute(query) {
        const {data, error} = await query;

        if (error) {
            return {success: false, error: error.message};
        }

        return {success: true, data};
    };

    applyCriteria(query, criteria) {
        criteria.forEach(criterion => query = criterion.apply(query));
        return query;
    }
}