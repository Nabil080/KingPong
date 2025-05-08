import { switchPlayerCardStatus } from "../components/player_card.js"
import { switchChatInput } from "../content/chat.js"
import { t } from "../translations/translations.js"
import { ConnectReply, LogoutReply, WebSocketMessage, WebSocketReply } from "../types/websocket.js"
import { App } from "./App.js"

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
		}
	}

	async sendLogoutMessage() {
		this.send({ type: "logout" })
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
			case "connect":
			case "logout":
				this.handleUserStatusReply(reply)
				break
			default:
				console.warn("Unknown WebSocket message type:", reply.type)
		}
	}

	// ------------------- REPLY HANDLERS ------------------
	// ------------------- REPLY HANDLERS ------------------
	// ------------------- REPLY HANDLERS ------------------
	// ------------------- REPLY HANDLERS ------------------

	async handleUserStatusReply(reply: ConnectReply | LogoutReply) {
		// Determine the status based on the reply type
		const status = reply.type === "connect" ? "online" : "offline"

		// Ignore update for self
		if (reply.userId === this.app.loggedUser?.id) {
			return
		}

		// Update user status in the cache
		await this.app.cache.updateStatus(reply.userId, status)

		// Ignore visual updates for blocked users
		if (this.app.cache.isBlocked(reply.userId)) {
			return
		}

		// Update visual indicators of user status
		switchPlayerCardStatus(this.app, reply.userId, status)
		switchChatInput(reply.userId, false)
		// const userData = wsClient.getUser(reply.userId)
		// const username = userData?.user?.username || reply.userId.toString
		// notif(`${username} ${t("disconnected")}`)
	}
}
