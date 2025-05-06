// src/modules/users/users.routes.ts
import { FastifyInstance } from "fastify"
import * as UsersController from "./users.controller.js"
import { getUserSchema, getAllUsersSchema } from "./users.schemas.js"

/**
 * Enregistre les routes utilisateurs
 * @param fastify Instance Fastify
 */
export function registerUsersRoutes(fastify: FastifyInstance): void {
	// Route pour récupérer tous les utilisateurs
	fastify.get("all", { schema: getAllUsersSchema }, UsersController.getAllUsers)

	fastify.get("list", UsersController.getCustomUserList)
	fastify.get("list/:id", UsersController.getCustomUserData)
	// Route pour récupérer un utilisateur par son ID
	fastify.get(":id", { schema: getUserSchema }, UsersController.getUserById)

	// Route pour modifier la relation de l'user de la session et d'une target
	fastify.post("/update/relationship", UsersController.modifyRelationship)

	fastify.post("/update/username", UsersController.updateUsername)
	fastify.post("/update/avatar", UsersController.updateAvatar)
	fastify.post("/update/password", UsersController.updatePassword)
	fastify.delete("/unblock/:userId", UsersController.unblockUser)

	fastify.delete("/delete/:id", UsersController.deleteUser)
}
