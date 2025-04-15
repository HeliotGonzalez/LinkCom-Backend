import supabase from "../../config/supabaseClient.js";
import {Repository} from "../../architecture/model/Repository.js";

const SupabaseComparisonMap = {
    'eq': (query, key, value) => query.eq(key, value),
    'neq': (query, key, value) => query.not(key, 'eq', value),
    'gt': (query, key, value) => query.gt(key, value),
    'lt': (query, key, value) => query.lt(key, value),
    'gte': (query, key, value) => query.gte(key, value),
    'lte': (query, key, value) => query.lte(key, value),
    'like': (query, key, value) => query.like(key, `%${value}%`),
    'ilike': (query, key, value) => query.ilike(key, `%${value}%`),
    'in': (query, key, value) => {
        const values = Array.isArray(value) ? value : value.split(',');
        return query.in(key, values);
    },
    'nin': (query, key, value) => {
        const values = Array.isArray(value) ? value : value.split(',');
        return query.not(key, 'in', values);
    },
    'is': (query, key, value) => query.is(key, value)
}

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

    async get(query) {
        console.log(query)
        return await this.execute(
            this.applyFilterQuery(
                supabase.from(this.table)
                    .select('*'),
                query
            )
        );
    }

    async update(query, parameters) {
        return await this.execute(
            this.applyFilterQuery(
                supabase.from(this.table)
                    .update(parameters),
                query
            ).select('*')
        );
    }

    async remove(query) {
        return await this.execute(
            this.applyFilterQuery(
                supabase.from(this.table)
                    .delete(),
                query
            ).select('*')
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

    applyFilterQuery(base, filter) {
        if (filter) Object.entries(filter).forEach(([key, valueTuple]) => {
            const splitValue = valueTuple.split('%')
            console.log(key, valueTuple)
            base = splitValue.length > 1 ?
                SupabaseComparisonMap[splitValue[0]](base, key, splitValue[1]) :
                SupabaseComparisonMap['eq'](base, key, splitValue[0]) ;
        });
        return base;
    }
}