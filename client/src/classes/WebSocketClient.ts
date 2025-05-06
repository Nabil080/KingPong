import { WebSocketMessage, WebSocketReply } from "../types/websocket"
import { App } from "./App"

export default class WebSocketClient {
	public ready: boolean = false
	private ws: WebSocket
	static URL = "wss://localhost:8080/ws"

	constructor(private app: App) {
		this.ws = new WebSocket(WebSocketClient.URL)
		this.connect()
	}

	/**
	 * Establishes WebSocket connection and sets up event handlers
	 */
	private connect() {
		this.ws.onopen = () => {
			console.log("WebSocket connection established")
			this.send({ type: "ping" })
			this.ready = true
		}

		this.ws.onclose = (event) => {
			console.warn("WebSocket connection closed:", event.reason)
		}

		this.ws.onerror = (error) => {
			console.error("WebSocket error:", error)
		}

		this.ws.onmessage = (event) => {
			const data = JSON.parse(event.data) as WebSocketReply
			this.handleReply(data)
		}
	}

	/**
	 * Sends a message through the WebSocket connection
	 * @param message - String or message object to send
	 */
	send(message: string | WebSocketMessage) {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			// Special handling for invite responses
			if (typeof message === "object" && message.type === "inviteResponse") {
				// Check if this is an accept response missing gameId
				if (message.response === "accept" && !message.gameId) {
					// Add the gameId if missing
					const fixedMessage = {
						...message,
						gameId: `game_${Date.now()}_${this.app.loggedUser?.id}_${message.senderId}`,
					}
					const data = JSON.stringify(fixedMessage)
					this.ws.send(data)
					return
				}
			}

			// Normal processing for other message types
			const data = typeof message === "string" ? message : JSON.stringify(message)
			console.log("Websocket Sent: ", data)
			this.ws.send(data)
		} else {
			console.warn("WebSocket is not connected yet")
		}
	}

	/**
	 * Establishes a websocket connection for the current user and initializes user data
	 * This should be called after successful authentication
	 */
	async sendConnectMessage() {
		if (this.app.loggedUser) {
			this.send({ type: "connect", userId: this.app.loggedUser.id })
			// // Fetch personalized user list instead of public list
			// await wsClient.fetchInitialUsers()
		}
	}

	async sendLogoutMessage() {
		this.send({ type: "logout" })
		// // Restore public user list after logout
		// await wsClient.fetchInitialUsers()
	}
	/**
	 * Handles incoming WebSocket messages
	 * @param data - The received message data
	 */
	private handleReply(reply: WebSocketReply) {
		console.log("WebSocket reply:", reply)
		switch (reply.type) {
			case "pong":
				console.log("Websocket received pong")
				break
			default:
				console.warn("Unknown WebSocket message type:", reply.type)
		}
	}
}
