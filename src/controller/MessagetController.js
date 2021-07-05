import EventManager from "js-simple-events/index";

export class MGController {

    constructor(server, password, options = {}) {
        this._server = server;
        this._password = password;
        this._endpiont = "";

        if (options.secure) {
            this.endpiont = "https://" + this._server
        } else {
            this.endpiont = "http://" + this._server
        }

        if (options.port) {
            this.endpiont += ":" + options.port;
        }
    }

    _buildEndpoint() {
        return this._endpiont + "/api/intent?password=" + this._password
    }

    async _makeRequest(data) {
        try {
            let request = await fetch(this._buildEndpoint(), {
                body: JSON.stringify(data)
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