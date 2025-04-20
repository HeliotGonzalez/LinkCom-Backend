/**
 * @interface
 */
export class DomainSocket {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
    }

    initialize() {}
}