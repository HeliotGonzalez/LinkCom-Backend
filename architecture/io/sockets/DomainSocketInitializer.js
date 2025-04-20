import socketsFactory from "../../../application/utils/DomainSocketFactory.js";
import {ServiceDomainSocket} from "./ServiceDomainSocket.js";

export const initializeSockets = (socket, io) => {
    socketsFactory
        .put('Communities', new ServiceDomainSocket(socket, io, 'Communities'))
        .put('CommunityUser', new ServiceDomainSocket(socket, io, 'CommunityUser'))
        .put('Events', new ServiceDomainSocket(socket, io, 'Events'))
        .put('JoinRequests', new ServiceDomainSocket(socket, io, 'JoinRequests'))
        .put('Announcements', new ServiceDomainSocket(socket, io, 'Announcements'));
}