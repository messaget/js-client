import {MessaGetEvent, MGClient} from "./client/MessagetClient";
import {MessaGetControllerEvent, MGController} from "./controller/MessagetController";

// exports for es6
export const MessaGetClient = MGClient
export const MessaGetController = MGController

export const MessaGet = {
    Client: MGClient,
    Controller: MGController,
    Events: MessaGetEvent,
    ControllerEvents: MessaGetControllerEvent
}
