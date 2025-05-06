import { App } from "./classes/App.js"
import Server from "./classes/Server.js"
import WebSocketClient from "./classes/WebSocketClient.js"

App.URL = "https://localhost:3000" // Set the URL for the app
Server.URL = "https://localhost:8080" // Set the URL for the server
WebSocketClient.URL = "wss://localhost:8080/ws" // Set the URL for the WebSocket client

const app = new App()

app.start()

export { app }
