// src/modules/common/common.routes.ts
import { FastifyInstance } from "fastify"
import { healthCheckSchema } from "./common.schemas.js"
import { seedDatabase } from "../../core/seed.js"
import db from "../../core/db.js"

/**
 * Enregistre les routes communes
 * @param fastify Instance Fastify
 */
export function registerCommonRoutes(fastify: FastifyInstance): void {
	// Route de vérification de l'état du serveur
	fastify.get("/health", { schema: healthCheckSchema }, (_, reply) => {
		reply.send({ status: "ok", timestamp: new Date().toISOString() })
	})

	fastify.get("/dummy", (_, reply) => {
		seedDatabase(db)
		reply.send({ success: true, message: "Dummy data inserted successfully!" })
	})
}
