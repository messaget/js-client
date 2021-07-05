import EventManager from 'js-simple-events'

export const MessaGetEvent = {
    CONNECTING: "CONNECTING",
    CONNECT: "CONNECT",
    ERROR: "ERROR",
    DISCONNECT: "DISCONNECT",
}

export class MGClient {

    constructor(server, namespace, options = {}) {
        this.eventManager = new EventManager();
        this.server = server;
        this.namespace = namespace;
        this.endpiont = "";
        this.isConnected = false;
        this.isConnecting = false;

        if (options.secure) {
            this.endpiont = "wss://" + this.server
        } else {
            this.endpiont = "ws://" + this.server
        }

        if (options.port) {
            this.endpiont += ":" + options.port;
        }

        // append namespace
        if (namespace.length === 0) throw new Error("You must provide a namespace");
    }

    connect() {
        this._setupWs()
    }

    _setupWs() {
        if (this.isConnected || this.isConnecting) return
        this.isConnecting = true;
        this._ws = new WebSocket(this._buildEndpoint())
        this._ws.onclose = (e) => {
            // close
            this.isConnected = false;
            this.isConnecting = false;
            this.eventManager.fire(MessaGetEvent.DISCONNECT, e)
        }
        this._ws.onerror = (e) => {
            // close
            this.isConnected = false;
            this.isConnecting = false;
            this.eventManager.fire(MessaGetEvent.ERROR, e)
        }
        this._ws.onopen = (e) => {
            this.isConnected = true;
            this.isConnecting = false;
            this.eventManager.fire(MessaGetEvent.CONNECT, e)
        }
    }

    _buildEndpoint() {
        return this.endpiont + "/public/attach?namespace=" + this.namespace
    }

}