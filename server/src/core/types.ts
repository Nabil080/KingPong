// src/core/types.ts

import { FastifySchema } from "fastify"

export type sqlOptions = {
	orderBy?: string
}

/**
 * @module User
 * @description Represents a user entity in the application.
 */
export default class User {
	public id?: number
	public username: string = ""
	public avatar: string = "default.png"
	public password: string = ""
	public two_factor_secret?: string
	public status: "online" | "playing" | "offline" | "hidden" | "deactivated" | "banned" = "online"
	public created_at?: Date

	/**
	 * Allow partial initialization like so new User({username: "Nabil", status:"banned"})
	 */
	constructor(init?: Partial<User>) {
		Object.assign(this, init)
	}

	isOnline = () => this.status === "online"
}

// Types pour les requêtes d'authentification
export interface RegisterRequest {
	username: string
	password: string
	avatar?: {
		data: string
		mimeType: string
		filename: string
	}
}

export interface LoginRequest {
	username: string
	password: string
}

// Types pour les réponses
export interface SuccessResponse {
	success: boolean
}

export interface ErrorResponse {
	error: string
}

export interface MaResponse {
	loggedIn: boolean
	user: User
}

/**
 * TypeScript interface for the body of the "register" request.
 * This defines the expected fields when a user tries to register.
 */
export interface RegisterUserBody {
	username: string
	password: string
}

/**
 * Fastify schema for validating the body of the POST /users/register route.
 * Ensures that:
 * - 'username' is a string with at least 3 characters
 * - 'password' is a string with at least 6 characters
 * Both fields are required.
 */
export const registerUserSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["username", "password"],
		properties: {
			username: { type: "string", minLength: 3 },
			password: { type: "string", minLength: 6 },
		},
	},
}

/**
 * TypeScript interface for the parameters of the "profile" route.
 * This describes the URL parameter `id`, which is optional and must be a number if provided.
 */
export interface ProfileParams {
	id?: number // Optional user ID in the URL (e.g. /profile/1)
}

/**
 * Fastify schema for validating the params of the GET /profile/:id? route.
 * Ensures that:
 * - If 'id' is provided, it must be an integer.
 */
export const profileSchema: FastifySchema = {
	params: {
		type: "object",
		properties: {
			id: { type: "integer" },
		},
	},
}
