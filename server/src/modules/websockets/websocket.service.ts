import { WebSocket } from "@fastify/websocket"
import {
	ChatMessage,
	ChatReply,
	ConnectMessage,
	ConnectReply,
	ErrorReply,
	PongReply,
	InviteMessage,
	InviteReply,
	InviteResponseMessage,
	InviteResponseReply,
	GameInputMessage,
	GameInputReply,
} from "./websocket.types.js"
import WebSocketManager from "./WebSocket.Manager.js"
import { getUserById } from "../auth/auth.service.js"
import { setStatus } from "../users/users.model.js"

/**
 * @module WebSocketServiceFactory
 * @description Factory function generating websocket service bound to a socket instance.
 */
export default function makeWebSocketService(socket: WebSocket) {
	let userId: number | null = null

	return {
		connectClient(message: ConnectMessage) {
			let reply: ConnectReply | ErrorReply = { type: "error" }

			//console.log("Trying to connect user id ", message.userId)
			//console.log("current id : ", userId)
			if (!message.userId) {
				reply.message = "userId is missing"
			} else if (userId || WebSocketManager.isConnected(message.userId)) {
				reply.message = "Already connected somewhere else"
			} else if (!getUserById(message.userId)) {
				reply.message = "Unknown id"
			} else {
				userId = message.userId
				WebSocketManager.addClient(message.userId, socket)
				reply = { type: "connect", userId: userId }
				setStatus(userId, "online")
			}

			if (reply.type == "error") WebSocketManager.reply(socket, reply)
			else WebSocketManager.broadcast(reply)
		},

		pingClient() {
			let reply: PongReply = { type: "pong", loggedIn: userId ? true : false }
			WebSocketManager.reply(socket, reply)
		},

		disconnectClient() {
			if (userId) {
				WebSocketManager.removeClient(userId)
				setStatus(userId, "offline")
				WebSocketManager.broadcast({ type: "logout", userId: userId })
				userId = null
			}
		},

		sendChat(message: ChatMessage) {
			let reply: ChatReply | ErrorReply = { type: "error" }

			if (!userId) {
				reply.message = "You are not connected"
			} else if (WebSocketManager.isConnected(message.targetId) == false) {
				reply.message = "Target is not connected"
			} else if (message.message == undefined) {
				reply.message = "Empty message"
			} else {
				reply = { type: "chat", senderId: userId, message: message.message }
			}

			if (reply.type == "error") {
				WebSocketManager.reply(socket, reply)
			} else {
				WebSocketManager.reply(socket, { type: "success" })
				WebSocketManager.sendTo(message.targetId, reply)
			}
		},
		sendInvite(message: InviteMessage) {
			let reply: InviteReply | ErrorReply = { type: "error" }

			if (!userId) {
				reply.message = "You are not connected"
			} else if (WebSocketManager.isConnected(message.targetId) == false) {
				reply.message = "Target is not connected"
			} else {
				// Create invite reply for target user
				reply = {
					type: "invite",
					senderId: userId,
					inviteId: Date.now(), // Generate a unique ID for this invite
				}
			}

			if (reply.type == "error") {
				WebSocketManager.reply(socket, reply)
			} else {
				// Send success to sender
				WebSocketManager.reply(socket, { type: "success" })
				// Send invite to target
				WebSocketManager.sendTo(message.targetId, reply)
			}
		},
		sendInviteResponse(message: InviteResponseMessage) {
			let reply: InviteResponseReply | ErrorReply = { type: "error" }

			if (!userId) {
				reply.message = "You are not connected"
			} else if (WebSocketManager.isConnected(message.senderId) == false) {
				reply.message = "Sender is not connected"
			} else if (message.response === "accept" && !message.gameId) {
				reply.message = "GameId is required when accepting an invitation"
			} else {
				// Create response reply with gameId
				reply = {
					type: "inviteResponse",
					inviteId: message.inviteId,
					senderId: userId,
					response: message.response,
					gameId: message.response === "accept" ? message.gameId! : "",
				}
			}

			if (reply.type == "error") {
				WebSocketManager.reply(socket, reply)
			} else {
				// Send success to respondent
				WebSocketManager.reply(socket, { type: "success" })
				// Send response to original sender
				WebSocketManager.sendTo(message.senderId, reply)

				// Send confirmation back to the accepting user
				// This allows the accepting client to also navigate to the game
				if (reply.type === "inviteResponse" && reply.response === "accept") {
					WebSocketManager.reply(socket, reply)
				}
			}
		},
		sendGameInput(message: GameInputMessage) {
			let reply: GameInputReply | ErrorReply = { type: "error" }

			if (!userId) {
				reply.message = "You are not connected"
			} else if (WebSocketManager.isConnected(message.targetId) == false) {
				reply.message = "Target is not connected"
			} else {
				// Create game input reply
				reply = {
					type: "gameinput",
					gameId: message.gameId,
					senderId: userId,
					inputType: message.inputType,
					paddlePosition: message.paddlePosition,
				}
			}

			if (reply.type == "error") {
				WebSocketManager.reply(socket, reply)
			} else {
				// Send success to sender
				WebSocketManager.reply(socket, { type: "success" })
				// Send game input to target
				WebSocketManager.sendTo(message.targetId, reply)
			}
		},
	}
}
