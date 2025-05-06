// src/modules/users/users.schemas.ts
import { FastifySchema } from "fastify"
import User from "../../core/types.js"
import { ChatMessage, ChatReply } from "../websockets/websocket.types.js"

export type RelationshipType = "friend" | "blocked" | null

export type Chat = ChatMessage | ChatReply

export type UserData = {
	user: User
	chats: Chat[]
	relationship: RelationshipType
}

export type UserWithRelationship = {
	id: number
	username: string
	avatar: string
	status: string
	relationship?: RelationshipType // may be null if no relation
}

/**
 * Schéma de l'objet utilisateur (sans mot de passe)
 */
const userSchema = {
	type: "object",
	properties: {
		id: { type: "number" },
		username: { type: "string" },
		avatar: { type: "string" },
		status: { type: "string" },
	},
}

/**
 * Schéma de validation pour la route de récupération de tous les utilisateurs
 */
export const getAllUsersSchema: FastifySchema = {
	response: {
		200: {
			type: "array",
			items: userSchema,
		},
		401: {
			type: "object",
			properties: {
				error: { type: "string" },
			},
		},
	},
}

/**
 * Schéma de validation pour la route de récupération d'un utilisateur par son ID
 */
export const getUserSchema: FastifySchema = {
	params: {
		type: "object",
		required: ["id"],
		properties: {
			id: { type: "string", pattern: "^\\d+$" },
		},
	},
	response: {
		200: userSchema,
		401: {
			type: "object",
			properties: {
				error: { type: "string" },
			},
		},
		404: {
			type: "object",
			properties: {
				error: { type: "string" },
			},
		},
	},
}
