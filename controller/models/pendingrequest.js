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
                this._reject({
                    code: 500,
                    response: "Request timed out..."
                })
            }
        }, 3000)
    }

    getPromise() {
        return this._promise;
    }

}