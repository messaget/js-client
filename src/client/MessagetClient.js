export class MGClient {

    constructor(server, namespace, options = {}) {
        this.server = server;
        this.namespace = namespace;
        this.endpiont = "";

        if (options.secure) {
            this.endpiont = "wss://" + this.server
        } else {
            this.endpiont = "ws://" + this.server
        }

        if (options.port) {
            this.endpiont += ":" + options.port;
        }
    }

}