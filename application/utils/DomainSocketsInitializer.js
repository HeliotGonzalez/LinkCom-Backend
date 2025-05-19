import socketsFactory from "./DomainSocketFactory.js";
import {SupabaseDomainSocket} from "../io/sockets/SupabaseDomainSocket.js";

export const initializeSockets = (socket, io) => {
    socketsFactory
        .put('Communities', new SupabaseDomainSocket(socket, io, 'Communities'))
        .put('CommunityUser', new SupabaseDomainSocket(socket, io, 'CommunityUser'))
        .put('JoinRequests', new SupabaseDomainSocket(socket, io, 'JoinRequests'))
        .put('Announcements', new SupabaseDomainSocket(socket, io, 'Announcements'))
        .put('Events', new SupabaseDomainSocket(socket, io, 'Events'))
        .put('EventUser', new SupabaseDomainSocket(socket, io, 'EventUser'))
        .put('Users', new SupabaseDomainSocket(socket, io, 'Users'))
        .put('Friends', new SupabaseDomainSocket(socket, io, 'Friends'))
        .put('FriendRequests', new SupabaseDomainSocket(socket, io, 'FriendRequests'))
        .put('Messages', new SupabaseDomainSocket(socket, io, 'Messages'))
        .put('Notifications', new SupabaseDomainSocket(socket, io, 'Notifications'))
        .put('UserChat', new SupabaseDomainSocket(socket, io, 'UserChat'))
}