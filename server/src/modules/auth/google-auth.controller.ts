// src/modules/auth/google-auth.controller.ts
import { FastifyRequest, FastifyReply } from "fastify"
import { OAuth2Client } from "google-auth-library"
import { findOrCreateGoogleUser } from "./auth.service.js"
import { sendError } from "../../utils/errorHandler.js"
import WebSocketManager from "../websockets/WebSocket.Manager.js"
import { t } from "../../translation.js"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

if (!GOOGLE_CLIENT_ID) {
	console.error("GOOGLE_CLIENT_ID is not set in environment variables")
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID)

interface GoogleTokenRequest {
	Body: {
		credential: string
	}
}

export async function googleSignIn(request: FastifyRequest<GoogleTokenRequest>, reply: FastifyReply) {
	try {
		console.log("Received Google sign-in request")

		const { credential } = request.body

		if (!credential) {
			return reply.status(400).send({ error: `${t("noCredential")}` })
		}

		// Verify the Google token
		const ticket = await client.verifyIdToken({
			idToken: credential,
			audience: GOOGLE_CLIENT_ID,
		})

		const payload = ticket.getPayload()

		if (!payload) {
			return reply.status(401).send({ error: `${t("invaliToken")}` })
		}

		// Find or create user
		const userId = await findOrCreateGoogleUser(payload.sub, payload.email!, payload.name!, payload.picture)

		// Check if user is already connected elsewhere
		if (WebSocketManager.isConnected(userId)) {
			return sendError(reply, 402, `${t("connectSomewhereElse")}`)
		}

		// Set session
		request.session.userId = userId

		// Make sure session is saved
		await request.session.save()

		console.log("Google sign-in successful, session created for user:", userId)
		return reply.send({ success: true })
	} catch (error) {
		console.error("Google sign-in error:", error)
		return reply.status(401).send({ error: `${t("flag")}` })
	}
}
