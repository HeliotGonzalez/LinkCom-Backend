import {DomainSocket} from './DomainSocket.js';

/**
 * @implements {DomainSocket}
 */
export class ServiceDomainSocket extends DomainSocket {

    constructor(socket, io, table) {
        super(socket, io);
        this.table = table.toLowerCase();
    }

    onInsert() {
        this.socket.on(`${this.table}:insert`, (data) => {
            this.io.emit(`${this.table}:insert`, data);
        });
    }

    onUpdate() {
        this.socket.on(`${this.table}:update`, (data) => {
            this.io.emit(`${this.table}:update`, data);
        });
    }

    onDelete() {
        this.socket.on(`${this.table}:delete`, (data) => {
            this.io.emit(`${this.table}:delete`, data);
        });
    }
}