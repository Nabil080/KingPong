// src/server.ts
import Fastify from "fastify"
import { setupServer } from "./config/server.js"
import fs from "fs"
import { cleanupBeforeExit } from "./utils/shutdown.js"

const envToLogger = {
	development: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "SYS:HH:MM:ss",
				ignore: "pid,hostname,reqId,responseTime",
			},
		},
	},
	production: true,
	test: false,
}

// 🔹 Initialisation du serveur Fastify
const fastify = Fastify({
	logger: envToLogger.development,
	https: {
		key: fs.readFileSync("/etc/ssl/private/server.key"),
		cert: fs.readFileSync("/etc/ssl/certs/server.crt"),
	},
})

// 🔹 Configuration du serveur (cors, cookies, sessions) et enregistrement des routes
setupServer(fastify)

// 🔹 Lancement du serveur sur le port 8080
fastify.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	//console.log(`🚀 Server running at ${address}`)
})

// Handle process signals for graceful shutdown
process.on("SIGINT", async () => {
	//console.log("Received SIGINT. Gracefully shutting down...")
	await cleanupBeforeExit()
	process.exit(0)
})

process.on("SIGTERM", async () => {
	//console.log("Received SIGTERM. Gracefully shutting down...")
	await cleanupBeforeExit()
	process.exit(0)
})

process.on("SIGUSR2", async () => {
	//console.log("Received SIGUSR2 (nodemon restart). Cleaning up...")
	await cleanupBeforeExit()
	process.exit(0)
})
