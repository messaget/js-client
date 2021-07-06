import {MGConnectedClient} from "./models/client";
import EventManager from 'js-simple-events'

export const MessaGetControllerEvent = {
    CLIENT_JOINED: "CLIENT_JOINED",
    CLIENT_LEFT: "CLIENT_LEFT",
    BUS_CONNECTED: "BUS_CONNECTED",
    BUS_DISCONNECTED: "BUS_DISCONNECTED",
}

export class MGController {

    constructor(server, password, options = {}) {
        this._eventManager = new EventManager();
        this._server = server;
        this._password = password;
        this._endpiont = "";
        this._isConnected = false;
        this._isConnecting = false;

        if (options.secure) {
            this._endpiont = "https://" + this._server
        } else {
            this._endpiont = "http://" + this._server
        }

        if (options.port) {
            this._endpiont += ":" + options.port;
        }
    }

    /**
     * Send a message to multiple clients at once (by ID's)
     */
    async sendMessageToIds(ids, message) {
        await this._makeRequest({
            intent: "SEND_TO_IDS",
            targets: ids,
            message: message
        })
    }

    /**
     * Find all online clients
     * @returns {Promise<[MGConnectedClient]>}
     */
    async findAllClients() {
        let clientsJson = await this._makeRequest({
            intent: "LIST_CLIENTS"
        })
        return this._mapClientsArr(clientsJson)
    }

    /**
     * Find a specific online client, returns NULL if the client is offline
     * @param id Client ID
     * @returns {Promise<null|MGConnectedClient>}
     */
    async findClientById(id) {
        let results = await this.findClientsByIds([id])
        if (results.length === 0) return null;
        return results[0];
    }

    /**
     * Find all clients that partially match namespace
     * @param namespace Partial namespace
     * @returns {Promise<null|MGConnectedClient[]>}
     */
    async findClientsByPartialNamespace(namespace) {
        let clientsJson = await this._makeRequest({
            intent: "FIND_BY_NAMESPACE",
            namespace: namespace
        })

        let results = this._mapClientsArr(clientsJson);
        if (results.length === 0) return null;
        return results;
    }

    /**
     * Find all clients that exactly match a namespace
     * @param namespace Partial namespace
     * @returns {Promise<null|MGConnectedClient[]>}
     */
    async findClientsByExactNamespace(namespace) {
        let clientsJson = await this._makeRequest({
            intent: "FIND_BY_NAMESPACE_EXACT",
            namespace: namespace
        })

        let results = this._mapClientsArr(clientsJson);
        if (results.length === 0) return null;
        return results;
    }

    /**
     * Find multiple clients at once, invalid ID's won't be included in the response
     * @param ids Client ID
     * @returns {Promise<null|[MGConnectedClient]>}
     */
    async findClientsByIds(ids) {
        let clientsJson = await this._makeRequest({
            intent: "FIND_BY_IDS",
            targets: ids
        })

        return this._mapClientsArr(clientsJson);
    }

    /**
     * Handle events, and setup ws if we haven't already
     * @param event
     * @param handler
     */
    on(event, handler) {
        this._eventManager.on(event, handler)
        this._setupWs()
    }

    _buildEndpoint() {
        return this._endpiont + "/api/intent?password=" + this._password
    }

    _buildWsEndpoint() {
        return this._endpiont.replace("http", "ws") + "/api/attach?password=" + this._password
    }

    _handleWsInput(dataAsJson) {
        switch (dataAsJson.event) {
            case "CLIENT_ADD":
                // client joined
                this._eventManager.fire(MessaGetControllerEvent.CLIENT_JOINED, this._mapClientsArr([dataAsJson.client])[0])
                break

            case "CLIENT_LEAVE":
                // client left
                this._eventManager.fire(MessaGetControllerEvent.CLIENT_LEFT, this._mapClientsArr([dataAsJson.client])[0])
                break
        }
    }

    _setupWs() {
        if (this._isConnected || this._isConnecting) return
        this._isConnecting = true;
        this._ws = new WebSocket(this._buildWsEndpoint())
        let retry = () => {
            this._eventManager.fire(MessaGetControllerEvent.BUS_DISCONNECTED, null)
            setTimeout(() => {
                this._setupWs()
            }, 150)
        }
        this._ws.onclose = (e) => {
            // close
            this._isConnected = false;
            this._isConnecting = false;
            retry()
        }
        this._ws.onerror = (e) => {
            // close
            this._isConnected = false;
            this._isConnecting = false;
            retry()
        }
        this._ws.onmessage = (e) => {
            this._handleWsInput(JSON.parse(e.data))
        }
        this._ws.onopen = (e) => {
            this._isConnected = true;
            this._isConnecting = false;
            this._eventManager.fire(MessaGetControllerEvent.BUS_CONNECTED, null)
        }
    }

    _mapClientsArr(clientsJson) {
        let clients = [];
        for (let i = 0; i < clientsJson.length; i++) {
            let c = clientsJson[i]
            clients.push(new MGConnectedClient(this, c.id, c.namespace, c.ip))
        }
        return clients;
    }

    async _makeRequest(data) {
        try {
            let request = await fetch(this._buildEndpoint(), {
                body: JSON.stringify(data),
                method: "POST"
            })

            if (request.status !== 200) {
                throw new Error("Failed to make request");
            }

            return await request.json();
        } catch (e) {
            console.error(e)
            throw new Error("Failed to make request");
        }

    }
}