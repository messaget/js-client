import EventManager from 'js-simple-events'

export const MessaGetEvent = {
    CONNECTING: "CONNECTING",
    CONNECT: "CONNECT",
    ERROR: "ERROR",
    DISCONNECT: "DISCONNECT",
    MESSAGE: "MESSAGE"
}

export class MGClient {

    constructor(server, namespace, options = {}) {
        this._eventManager = new EventManager();
        this._server = server;
        this._namespace = namespace;
        this._endpiont = "";
        this._isConnected = false;
        this._isConnecting = false;

        if (options.secure) {
            this._endpiont = "wss://" + this._server
        } else {
            this._endpiont = "ws://" + this._server
        }

        if (options.password) {
            this._password = options.password;
        }

        if (options.port) {
            this._endpiont += ":" + options.port;
        }

        // append namespace
        if (namespace.length === 0) throw new Error("You must provide a namespace");
    }

    on(event, handler) {
        this._eventManager.on(event, handler)
    }

    connect() {
        this._setupWs()
    }

    _setupWs() {
        if (this._isConnected || this._isConnecting) return
        this._isConnecting = true;
        this._ws = new WebSocket(this._buildEndpoint())
        this._ws.onclose = (e) => {
            // close
            this._isConnected = false;
            this._isConnecting = false;
            this._eventManager.fire(MessaGetEvent.DISCONNECT, e)
        }
        this._ws.onerror = (e) => {
            // close
            this._isConnected = false;
            this._isConnecting = false;
            this._eventManager.fire(MessaGetEvent.ERROR, e)
        }
        this._ws.onmessage = (e) => {
            this._eventManager.fire(MessaGetEvent.MESSAGE, e.data)
        }
        this._ws.onopen = (e) => {
            this._isConnected = true;
            this._isConnecting = false;
            this._eventManager.fire(MessaGetEvent.CONNECT, e)
        }
    }

    _buildEndpoint() {
        return this._endpiont + "/public/attach?namespace=" + this._namespace + "&password=" + this._password
    }

}