import {DomainSocket} from "../../../architecture/io/sockets/DomainSocket.js";

/**
 * @implements {DomainSocket}
 */
export class SupabaseDomainSocket extends DomainSocket {

    constructor(socket, io, table) {
        super(socket, io);
        this.table = table;
        this.initialize();
    }

    initialize() {
        this.socket
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: this.table
                },
                (payload) => this.io.emit(`${this.table.toLowerCase()}:${payload.type}`, payload)
            )
            .subscribe()
    }
}