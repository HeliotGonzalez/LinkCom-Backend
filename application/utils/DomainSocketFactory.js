export class DomainSocketFactory {
    constructor() {
        this.sockets = {};
    }

    put(key, socket) {
        this.sockets[key] = socket;
        return this;
    }

    get(key) {
        return this.sockets[key];
    }
}

const socketsFactory = new DomainSocketFactory();

export default socketsFactory;