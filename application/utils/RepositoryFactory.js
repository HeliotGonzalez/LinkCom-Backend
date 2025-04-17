import {SupabaseRepository} from "../io/supabaseRepository.js";

export class RepositoryFactory {
    constructor() {
        this.repositories = {};
    }

    put(key, repository) {
        this.repositories[key] = repository;
        return this;
    }

    get(key) {
        return this.repositories[key];
    }
}

const repositoryFactory = new RepositoryFactory();
repositoryFactory
    .put('Communities', new SupabaseRepository('Communities'))
    .put('CommunityUser', new SupabaseRepository('CommunityUser'))
    .put('Events', new SupabaseRepository('Events'))
    .put('EventUser', new SupabaseRepository('EventUser'))
    .put('Users', new SupabaseRepository('Users'))
    .put('Announcements', new SupabaseRepository('Announcements'))
    .put('CommunityInterest', new SupabaseRepository('CommunityInterest'))
    .put('UserInterest', new SupabaseRepository('UserInterest'))
    .put('EventInterest', new SupabaseRepository('EventInterest'))
    .put('Interests', new SupabaseRepository('Interests'));

export default repositoryFactory;