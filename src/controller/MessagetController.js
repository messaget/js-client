import {MGConnectedClient} from "./models/client";


export class MGController {

    constructor(server, password, options = {}) {
        this._server = server;
        this._password = password;
        this._endpiont = "";

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
     * @returns {Promise<null|MGConnectedClient>}
     */
    async findClientsByPartialNamespace(namespace) {
        let clientsJson = await this._makeRequest({
            intent: "FIND_BY_NAMESPACE",
            namespace: namespace
        })

        let results = this._mapClientsArr(clientsJson);
        if (results.length === 0) return null;
        return results[0];
    }

    /**
     * Find all clients that exactly match a namespace
     * @param namespace Partial namespace
     * @returns {Promise<null|MGConnectedClient>}
     */
    async findClientsByExactNamespace(namespace) {
        let clientsJson = await this._makeRequest({
            intent: "FIND_BY_NAMESPACE_EXACT",
            namespace: namespace
        })

        let results = this._mapClientsArr(clientsJson);
        if (results.length === 0) return null;
        return results[0];
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

    _buildEndpoint() {
        return this._endpiont + "/api/intent?password=" + this._password
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