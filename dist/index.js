!function(t){var e={};function n(s){if(e[s])return e[s].exports;var i=e[s]={i:s,l:!1,exports:{}};return t[s].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,s){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(s,i,function(e){return t[e]}.bind(null,i));return s},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e),n.d(e,"MessaGetClient",(function(){return _})),n.d(e,"MessaGetController",(function(){return l}));var s=function(){function t(){this.eventHandlersMap={"*":new Map},this.isDebug=!1,this.fire=this.emit,this.listen=this.on,this.subscribe=this.on,this.remove=this.off,this.unsubscribe=this.off}return t.prototype.addEventHandler=function(t,e,n){void 0===n&&(n=!1),this.eventHandlersMap[t]||(this.eventHandlersMap[t]=new Map),e&&!this.eventHandlersMap[t].has(e)&&this.eventHandlersMap[t].set(e,n)},t.prototype.callHandlers=function(t,e,n){var s=this;this.eventHandlersMap[t]&&this.eventHandlersMap[t].forEach((function(i,r){r&&r(e,{eventName:n||t,isOnce:i}),i&&s.off(t,r)}))},t.prototype.setDebug=function(t){return this.isDebug=t,this},t.prototype.on=function(t,e){return this.addEventHandler(t,e),this},t.prototype.once=function(t,e){return this.addEventHandler(t,e,!0),this},t.prototype.off=function(t,e){return this.eventHandlersMap[t]?(e&&this.eventHandlersMap[t].has(e)&&this.eventHandlersMap[t].delete(e),this):this},t.prototype.emit=function(t,e){this.isDebug&&console.info("["+this.constructor.name+"]: Fires "+t),this.callHandlers("*",e,t),this.callHandlers(t,e)},t}();const i={CONNECTING:"CONNECTING",CONNECT:"CONNECT",ERROR:"ERROR",DISCONNECT:"DISCONNECT",MESSAGE:"MESSAGE"};class r{constructor(t,e,n={}){if(this._eventManager=new s,this._server=t,this._namespace=e,this._endpiont="",this._isConnected=!1,this._isConnecting=!1,n.secure?this._endpiont="wss://"+this._server:this._endpiont="ws://"+this._server,n.password&&(this._password=n.password),n.port&&(this._endpiont+=":"+n.port),0===e.length)throw new Error("You must provide a namespace")}on(t,e){this._eventManager.on(t,e)}connect(){this._setupWs()}_setupWs(){this._isConnected||this._isConnecting||(this._isConnecting=!0,this._ws=new WebSocket(this._buildEndpoint()),this._ws.onclose=t=>{this._isConnected=!1,this._isConnecting=!1,this._eventManager.fire(i.DISCONNECT,t)},this._ws.onerror=t=>{this._isConnected=!1,this._isConnecting=!1,this._eventManager.fire(i.ERROR,t)},this._ws.onmessage=t=>{this._eventManager.fire(i.MESSAGE,t.data)},this._ws.onopen=t=>{this._isConnected=!0,this._isConnecting=!1,this._eventManager.fire(i.CONNECT,t)})}_buildEndpoint(){return this._endpiont+"/public/attach?namespace="+this._namespace+"&password="+this._password}}class a{constructor(t,e,n,s){this._controller=t,this._id=e,this._namespace=n,this._ip=s}async kick(){await this._controller._makeRequest({intent:"KICK_CLIENTS_BY_ID",targets:[this._id]})}async sendMessage(t){if(0===(await this._controller._makeRequest({intent:"SEND_TO_IDS",targets:[this._id],message:t})).sent)throw new Error("Failed to send, this client is probably already offline.")}getId(){return this._id}getNamespace(){return this._namespace}getIp(){return this._ip}}const o={CLIENT_JOINED:"CLIENT_JOINED",CLIENT_LEFT:"CLIENT_LEFT",BUS_CONNECTED:"BUS_CONNECTED",BUS_DISCONNECTED:"BUS_DISCONNECTED"};class h{constructor(t,e,n={}){this._eventManager=new s,this._server=t,this._password=e,this._endpiont="",this._isConnected=!1,this._isConnecting=!1,n.secure?this._endpiont="https://"+this._server:this._endpiont="http://"+this._server,n.port&&(this._endpiont+=":"+n.port)}async sendMessageToIds(t,e){await this._makeRequest({intent:"SEND_TO_IDS",targets:t,message:e})}async findAllClients(){let t=await this._makeRequest({intent:"LIST_CLIENTS"});return this._mapClientsArr(t)}async findClientById(t){let e=await this.findClientsByIds([t]);return 0===e.length?null:e[0]}async findClientsByPartialNamespace(t){let e=await this._makeRequest({intent:"FIND_BY_NAMESPACE",namespace:t}),n=this._mapClientsArr(e);return 0===n.length?null:n[0]}async findClientsByExactNamespace(t){let e=await this._makeRequest({intent:"FIND_BY_NAMESPACE_EXACT",namespace:t}),n=this._mapClientsArr(e);return 0===n.length?null:n[0]}async findClientsByIds(t){let e=await this._makeRequest({intent:"FIND_BY_IDS",targets:t});return this._mapClientsArr(e)}on(t,e){this._eventManager.on(t,e),this._setupWs()}_buildEndpoint(){return this._endpiont+"/api/intent?password="+this._password}_buildWsEndpoint(){return this._endpiont+"/api/attach?password="+this._password}_handleWsInput(t){switch(t.event){case"CLIENT_ADD":this._eventManager.fire(o.CLIENT_JOINED,this._mapClientsArr([t.client])[0]);break;case"CLIENT_LEAVE":this._eventManager.fire(o.CLIENT_LEFT,this._mapClientsArr([t.client])[0])}}_setupWs(){if(this._isConnected||this._isConnecting)return;this._isConnecting=!0,this._ws=new WebSocket(this._buildWsEndpoint());let t=()=>{this._eventManager.fire(o.BUS_DISCONNECTED,null),setTimeout(()=>{this._setupWs()},150)};this._ws.onclose=e=>{this._isConnected=!1,this._isConnecting=!1,t()},this._ws.onerror=e=>{this._isConnected=!1,this._isConnecting=!1,t()},this._ws.onmessage=t=>{this._handleWsInput(JSON.parse(t.data))},this._ws.onopen=t=>{this._isConnected=!0,this._isConnecting=!1,this._eventManager.fire(o.BUS_CONNECTED,null)}}_mapClientsArr(t){let e=[];for(let n=0;n<t.length;n++){let s=t[n];e.push(new a(this,s.id,s.namespace,s.ip))}return e}async _makeRequest(t){try{let e=await fetch(this._buildEndpoint(),{body:JSON.stringify(t),method:"POST"});if(200!==e.status)throw new Error("Failed to make request");return await e.json()}catch(t){throw console.error(t),new Error("Failed to make request")}}}const _=r,l=h;window&&(window.MessaGetController=h,window.MessaGetClient=r,window.MessaGetEvent=i,window.MessaGetControllerEvent=o)}]);