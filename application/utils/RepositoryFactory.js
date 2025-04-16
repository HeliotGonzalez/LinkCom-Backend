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

const factory = new RepositoryFactory();
factory.put('Communities', new SupabaseRepository('Communities'));
factory.put('CommunityUser', new SupabaseRepository('CommunityUser'));
factory.put('Events', new SupabaseRepository('Events'));
factory.put('EventUser', new SupabaseRepository('EventUser'));
factory.put('Users', new SupabaseRepository('Users'));
factory.put('Announcements', new SupabaseRepository('Announcements'));
factory.put('CommunityInterest', new SupabaseRepository('CommunityInterest'));
factory.put('UserInterest', new SupabaseRepository('UserInterest'));
factory.put('EventInterest', new SupabaseRepository('EventInterest'));
factory.put('Interests', new SupabaseRepository('Interests'));

export default factory;