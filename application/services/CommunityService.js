// src/services/CommunityService.js
import { Service } from "../../architecture/model/Service.js";
import { SupabaseRepository } from "../repositories/SupabaseRepository.js";

export class CommunityService extends Service {
  constructor(repository) {
    super();
    this._repository = repository;
    this.userRepository = new SupabaseRepository('Users');
    this.communityUserRepository = new SupabaseRepository('CommunityUser');
  }

  repository() {
    return this._repository;
  }

  async create(parameters) {
    return await this._repository.create(parameters);
  }

  async get(query) {
    return await this._repository.get(query);
  }

  async update(query, parameters) {
    return await this._repository.update(query, parameters);
  }

  async delete(query) {
    return await this._repository.remove(query);
  }

  /**
   * Obtiene las comunidades públicas a las que el usuario NO pertenece,
   *
   * Se aplica el filtro isPrivate = false y, si el usuario ya está en alguna comunidad,
   * se excluyen dichas comunidades usando el operador "nin" en el campo "id".
   *
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object[]>} - Arreglo de comunidades filtradas.
   */
  async getNonBelongingCommunities(userId) {
    if (!userId) {
      throw new Error("El parámetro userId es requerido");
    }

    // 1. Verificar que el usuario exista (usamos el repositorio genérico)
    const userRes = await this.userRepository.get({ id: userId });
    if (!userRes.success || !userRes.data || userRes.data.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    // 2. Obtener las comunidades a las que el usuario ya pertenece
    const membershipsRes = await this.communityUserRepository.get({ userID: userId });
    if (!membershipsRes.success) {
      throw new Error(membershipsRes.error);
    }
    const membershipIDs = membershipsRes.data.map(item => item.communityID);

    // 3. Construir el filtro para las comunidades públicas
    const filter = { isPrivate: "false" }; 
    console.log('Comunidades a las que pertenezco: ', membershipIDs);
    // Si el usuario ya pertenece a algunas comunidades, agregamos el filtro "nin" para el id
    if (membershipIDs.length > 0) {
      // El formato para la comparación "nin" en el repositorio es: valor => "nin%valor1,valor2,..."
      filter.id = `nin%(${membershipIDs.join(',')})`;
    }

    // 4. Obtener las comunidades públicas que cumplan el filtro
    const communitiesRes = await this._repository.get(filter);
    if (!communitiesRes.success) {
      throw new Error(communitiesRes.error);
    }
    return communitiesRes.data;
  }
}
