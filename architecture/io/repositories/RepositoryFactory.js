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