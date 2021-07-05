import {MessaGetEvent, MGClient} from "./client/MessagetClient";
import {MGController} from "./controller/MessagetController";

// exports for es6
export const MessaGetClient = MGClient
export const MessaGetController = MGController

// window attachments
window.MessaGetController = MGController
window.MessaGetClient = MGClient
window.MessaGetEvent = MessaGetEvent