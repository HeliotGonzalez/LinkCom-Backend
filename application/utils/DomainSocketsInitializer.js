import socketsFactory from "./DomainSocketFactory.js";
import {SupabaseDomainSocket} from "../io/sockets/SupabaseDomainSocket.js";

export const initializeSockets = (socket, io) => {
    socketsFactory
        .put('Communities', new SupabaseDomainSocket(socket, io, 'Communities'))
        .put('CommunityUser', new SupabaseDomainSocket(socket, io, 'CommunityUser'))
        .put('JoinRequests', new SupabaseDomainSocket(socket, io, 'JoinRequests'))
        .put('Announcements', new SupabaseDomainSocket(socket, io, 'Announcements'))
        .put('Events', new SupabaseDomainSocket(socket, io, 'Events'))
        .put('Users', new SupabaseDomainSocket(socket, io, 'Users'))
}