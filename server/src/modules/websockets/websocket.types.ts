export type ConnectMessage = { type: "connect"; userId: number }
export type PingMessage = { type: "ping" }
export type LogoutMessage = { type: "logout" }
export type ChatMessage = { type: "chat"; targetId: number; message: string }
export type InviteMessage = { type: "invite"; targetId: number }
export type InviteResponseMessage = {
	type: "inviteResponse"
	inviteId: number
	senderId: number
	response: "accept" | "decline"
	gameId?: string // Required for "accept", optional for "decline"
}
export type GameInputMessage = {
	type: "gameinput"
	gameId: string
	inputType: "paddleMove" | "startGame" | "resetGame"
	paddlePosition?: number
	targetId: number
}

export type PongReply = { type: "pong"; loggedIn: boolean }
export type ConnectReply = { type: "connect"; userId: number }
export type LogoutReply = { type: "logout"; userId: number }
export type ChatReply = { type: "chat"; senderId: number; message: string }
export type ErrorReply = { type: "error"; message?: string }
export type SuccessReply = { type: "success" }
export type InviteReply = { type: "invite"; senderId: number; inviteId: number }
export type InviteResponseReply = {
	type: "inviteResponse"
	inviteId: number
	senderId: number
	response: "accept" | "decline"
	gameId: string // Always included, empty string for "decline"
}
export type GameInputReply = {
	type: "gameinput"
	gameId: string
	senderId: number
	inputType: "paddleMove" | "startGame" | "resetGame"
	paddlePosition?: number
}

export type WebSocketMessage = ConnectMessage | PingMessage | LogoutMessage | ChatMessage | InviteMessage | InviteResponseMessage | GameInputMessage
export type WebSocketReply =
	| PongReply
	| ConnectReply
	| LogoutReply
	| ChatReply
	| InviteReply
	| InviteResponseReply
	| ErrorReply
	| SuccessReply
	| GameInputReply
