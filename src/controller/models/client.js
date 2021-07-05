export class MGConnectedClient {

    constructor(controller, id, namespace, ip) {
        this._controller = controller;
        this._id = id;
        this._namespace = namespace;
        this._ip = ip;
    }

    async sendMessage(message) {
        let response = await this._controller._makeRequest({
            intent: "SEND_TO_IDS",
            targets: [this._id],
            message: message
        })
        if (response.sent === 0) {
            throw new Error("Failed to send, this client is probably already offline.")
        }
    }

    getId() {
        return this._id;
    }

    getNamespace() {
        return this._namespace;
    }

    getIp() {
        return this._ip;
    }

}