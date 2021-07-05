<p align="center">
  <img src="https://i.imgur.com/7dtHykL.png" />
</p>

This is a simple Client/Controller implementation for the [MessaGet Server](https://github.com/messaget/messaget-server). Please visit the main repository for details about the project. This library can be implemented in your public web-app to receive real-time content updates, or in your ES6-based backend service with the Controller. Please note that you should never use the controller from public sources to protect your password and sensitive user data. Reverse-messaging (sending data from the client to a controller) is planned and will be added in the near future.

### Client
The Client is what connects to the server through the frontend, requires websocket to work, and is attached to the window by default (but is also accessible as ES6 import).

Example:
```javascript
let client = new MessaGetClient("localhost", "notifications:personal-user -oken", {
    port: 8080, // OPTIONAL - server port
    secure: false, // OPTIONAL - use SSL
})

client.on(MessaGetEvent.CONNECT, function (event) {
    console.log("Connected!")
})

client.on(MessaGetEvent.DISCONNECT, function (event) {
    console.log("Disconnected!")
})

client.on(MessaGetEvent.ERROR, function (error) {
    console.log("Error! ", event)
})

client.on(MessaGetEvent.MESSAGE, function (message) {
    console.log("message", message)
})

// connect
client.connect()
```

### Controller
The Controller is a privileged connection (using both REST and WebSocket) which is used to query clients, send data and manage connections. Websocket can be disabled, which would enable usage in headless workers (like cloudflare or fastly workers, to send messages from your backend service infrastructure)

Example:
```javascript
let controller = new MessaGetController("localhost", "super-secure-password", {
    port: 8080, // OPTIONAL - server port
    secure: false, // OPTIONAL - use SSL
    useWs: false, // OPTIONAL - only use REST
})

// find all notification clients
let notificationListeners = await controller.findClientsByPartialNamespace("notification:");

// send to all results, array may be empty
for (let i = 0; i < notificationListeners.length; i++) {
    notificationListeners[i].sendMessage("Hey there sunshine! I'm a global notification to all clients in the notification namespace!")
}

// or we can query by partial namespace, ID, or just gather everyone
// note that client may be null in this example, if the ID is invalid
let client = await controller.findClientById("c3hio6o6n88gufpd6l70");
// sendMessage will thrown an exception in this case if the client has disconnected between these function calls
await client.sendMessage("Hey there! I'm a personal message")
```