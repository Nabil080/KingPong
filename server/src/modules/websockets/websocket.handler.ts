import { FastifyRequest } from "fastify"
import { WebSocket } from "@fastify/websocket"
import { WebSocketMessage } from "./websocket.types.js"
import makeWebSocketService from "./websocket.service.js"
import { log } from "../../utils/logger.js"

/**
 * Main WebSocket connection handler.
 * @route GET /ws
 * @description Handles WebSocket events and messages.
 */
export default function handleConnection(socket: WebSocket, request: FastifyRequest) {
	const service = makeWebSocketService(socket)

	//console.log("New websocket connection")

	socket.on("message", (data: any) => {
		try {
			//console.log(data)
			const message = JSON.parse(data.toString()) as WebSocketMessage
			log(`Received: ${message}`)

			switch (message.type) {
				case "connect":
					service.connectClient(message)
					break

				case "ping":
					service.pingClient()
					break

				case "logout":
					service.disconnectClient()
					break

				case "chat":
					service.sendChat(message)
					break

				case "invite":
					service.sendInvite(message)
					break

				case "inviteResponse":
					service.sendInviteResponse(message)
					break

				case "gameinput":
					service.sendGameInput(message)
					break

				default:
					socket.send(JSON.stringify({ type: "error", message: "Unknown message type" }))
			}
		} catch {
			socket.send(JSON.stringify({ type: "error", message: "Invalid JSON" }))
		}
	})

	// logout client
	socket.on("close", () => {
		service.disconnectClient()
		//console.log("Websocket deconnected")
	})
}
