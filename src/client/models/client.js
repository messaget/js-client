export class Client {

    constructor(controller, id, namespace, ip) {
        this._controller = controller;
        this._id = id;
        this._namespace = namespace;
        this._ip = ip;
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