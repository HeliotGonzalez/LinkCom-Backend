export class ServiceFactory {
    constructor() {
        this.services = {};
    }

    put(key, value) {
        this.services[key] = value;
        return this;
    }

    get(key) {
        return this.services[key];
    }
}