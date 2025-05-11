import {ServiceFactory} from "../../architecture/io/services/ServiceFactory.js";
import {CommunityService} from "../../architecture/io/services/communityService.js";
import repositoryFactory from "./RepositoriesUtils.js";
import {UserService} from "../../architecture/io/services/UserService.js";
import {EventService} from "../../architecture/io/services/EventService.js";
import {MessageService} from "../../architecture/io/services/MessageService.js";

export const serviceFactory = new ServiceFactory();
serviceFactory
    .put('communities', new CommunityService(repositoryFactory))
    .put('users', new UserService(repositoryFactory))
    .put('events', new EventService(repositoryFactory))
    .put('messages', new MessageService(repositoryFactory))