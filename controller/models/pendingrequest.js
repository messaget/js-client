export class PendingRequest {

    constructor(controller, id) {
        this._finished = false;

        this._resolve = null;
        this._reject = null;

        this._promise = new Promise((myResolve, myReject) => {
            this._resolve = myResolve;
            this._reject = myReject;
        });

        setTimeout(() => {
            if (this._finished) {
                // timeout
                delete controller._pendingWsRequests[id]
                this._reject("Request timed out...")
            }
        }, 3000)
    }

    fail(statusCode, response) {
        this._finished = true;
        this._reject(response + " - " + statusCode)

    }

    resolve(statusCode, response) {
        this._finished = true;
        if (statusCode !== 200) {
            throw new Error(statusCode + " - " + JSON.stringify(response))
        }
        this._resolve(response)
    }

    getPromise() {
        return this._promise;
    }

}