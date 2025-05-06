// src/config/server.ts
import { FastifyInstance, FastifyPluginOptions } from "fastify"
import fastifyCookie from "@fastify/cookie"
import fastifySession from "@fastify/session"
import fastifyCors from "@fastify/cors"
import fastifyStatic from "@fastify/static"
import { randomBytes } from "crypto"
import path from "path"
import { registerAuthRoutes } from "../modules/auth/auth.routes.js"
import { registerUsersRoutes } from "../modules/users/users.routes.js"
import { registerCommonRoutes } from "../modules/common/common.routes.js"
import handleConnection from "../modules/websockets/websocket.handler.js"
import FastifyWebSocketPlugin from "@fastify/websocket"
import { registerMatchesRoutes } from "../modules/matches/matches.routes.js"

// Déclaration du module pour les sessions Fastify
declare module "fastify" {
	interface Session {
		userId?: number
	}
}

/**
 * Configure le serveur Fastify avec les plugins nécessaires
 * (CORS, cookies, sessions)
 */
export async function setupServer(fastify: FastifyInstance): Promise<void> {
	// 🔹 Configuration de CORS
	fastify.register(fastifyCors, {
		origin: true, // En développement, permet toutes les origines
		credentials: true, // Important pour les cookies et les sessions
		methods: ["GET", "POST", "PUT", "DELETE"]
	})

	// 🔹 Configuration des sessions et des cookies
	fastify.register(fastifyCookie)
	fastify.register(fastifySession, {
		secret: randomBytes(32).toString("hex"),
		cookie: {
			secure: false, // Mettre `true` en production avec HTTPS
			httpOnly: true,
			sameSite: "lax", // Aide à permettre les requêtes cross-origin avec credentials
		},
		saveUninitialized: false,
	})

	fastify.register(FastifyWebSocketPlugin)

	// 🔹 Configuration des fichiers statiques
	fastify.register(fastifyStatic, {
		root: path.join(process.cwd(), "public", "avatars"),
		prefix: "/avatars/",
		decorateReply: false, // Important pour éviter les conflits avec le précédent
	})

	// 🔹 Enregistrement des routes
	fastify.register(registerRoutes)
}

/**
 * Enregistre toutes les routes de l'application
 * @param fastify Instance Fastify
 */
function registerRoutes(fastify: FastifyInstance, options: FastifyPluginOptions): void {
	// Enregistrement des routes d'authentification
	fastify.register(registerAuthRoutes, { prefix: "auth/" })

	// Enregistrement des routes utilisateurs
	fastify.register(registerUsersRoutes, { prefix: "users/" })

	// Enregistrement des routes des matchs
	fastify.register(registerMatchesRoutes, { prefix: "matches/" })

	// Enregistrement des routes communes
	fastify.register(registerCommonRoutes)

	// Websocket entrypoint
	fastify.get("/ws", { websocket: true }, handleConnection)
}
