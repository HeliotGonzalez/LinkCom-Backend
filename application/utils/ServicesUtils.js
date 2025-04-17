import {ServiceFactory} from "../../architecture/io/services/ServiceFactory.js";
import {CommunityService} from "../../architecture/io/services/communityService.js";
import repositoryFactory from "./RepositoryFactory.js";
import {UserService} from "../../architecture/io/services/UserService.js";

export const serviceFactory = new ServiceFactory();
serviceFactory
    .put('communities', new CommunityService(repositoryFactory))
    .put('users', new UserService(repositoryFactory))
    .put('events', new EventService(repositoryFactory));