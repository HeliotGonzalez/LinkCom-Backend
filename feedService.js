// feedService.js
import supabase from './config/supabaseClient.js';

/**
 * Busca el usuario en la tabla "Users".
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
export async function getUser(userId) {
  const { data: user, error } = await supabase
    .from('Users')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return user;
}

/**
 * Obtiene los IDs de las comunidades a las que pertenece el usuario.
 * @param {string} userId 
 * @returns {Promise<string[]>}
 */
export async function getCommunityIds(userId) {
  const { data, error } = await supabase.from('CommunityUser').select('communityID').eq('userID', userId);
  if (error) throw error;
  return data.map(cu => cu.communityID);
}

/**
 * Obtiene los eventos recientes (últimos 2 días) de las comunidades proporcionadas,
 * excluyendo aquellos a los que el usuario ya pertenece.
 * @param {string[]} communityIds 
 * @param {string} twoDaysAgo Fecha límite en formato ISO.
 * @param {string} userId 
 * @returns {Promise<any[]>}
 */
export async function getRecentEvents(communityIds, twoDaysAgo, userId) {
  // Obtener los eventIDs a los que el usuario ya se ha unido
  const { data: userEvents, error: userEventsError } = await supabase.from('EventUser').select('eventID').eq('userID', userId);
  if (userEventsError) throw userEventsError;
  const joinedEventIDs = userEvents.map(ue => ue.eventID);

  // Consultar los eventos de las comunidades y filtrarlos por fecha
  let query = supabase.from('Events').select('*').in('communityID', communityIds).gte('created_at', twoDaysAgo);

  // Si el usuario ya se ha unido a algunos eventos, los excluimos
  if (joinedEventIDs.length > 0) {
    query = query.not('id', 'in', joinedEventIDs).limit(10);
  } else {
    query = query.limit(10);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Obtiene los anuncios recientes (últimos 2 días) de las comunidades proporcionadas.
 * @param {string[]} communityIds 
 * @param {string} twoDaysAgo Fecha límite en formato ISO.
 * @returns {Promise<any[]>}
 */
export async function getRecentAnnounces(communityIds, twoDaysAgo) {
  const { data, error } = await supabase
    .from('Announces')
    .select('*')
    .in('communityID', communityIds)
    .gte('created_at', twoDaysAgo)
    .limit(10);
  if (error) throw error;
  return data;
}
