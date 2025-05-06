import {SupabaseRepository} from "../io/repositories/supabaseRepository.js";
import {RepositoryFactory} from "../../architecture/io/repositories/RepositoryFactory.js";

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
    .put('Interests', new SupabaseRepository('Interests'))
    .put('JoinRequests', new SupabaseRepository('JoinRequests'))
    .put('Comments', new SupabaseRepository('Comments'))
    .put('Friends', new SupabaseRepository('Friends'))
    .put('FriendRequests', new SupabaseRepository('FriendRequests'));

export default repositoryFactory;