import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)

export const executeQuery = async (query) => {
    const {data, error} = await query;

    if (error) {
        console.error('Error en Supabase:', error.message);
        return {success: false, error: error.message};
    }

    return {success: true, data};
};

export default sql