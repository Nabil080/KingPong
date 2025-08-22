import { FastifyReply, FastifyRequest } from "fastify"
import { usernameExists } from "../users/users.model.js"
import { getMatchById, Match } from "./matches.model.js"
import { fetchAllMatches, fetchMatchesByUser, registerMatch } from "./matches.service.js"

/**
 * Create a new match.
 */
export async function createMatchHandler(request: FastifyRequest<{ Body: Match }>, reply: FastifyReply) {
	try {
		const match = request.body
		registerMatch(match)
		return reply.status(201).send({ success: true, message: "Match created successfully." })
	} catch (error) {
		console.error("Error creating match:", error)
		return reply.status(500).send({ error: "Failed to create match." })
	}
}

/**
 * Retrieve all matches.
 */
export async function getAllMatchesHandler(_: FastifyRequest, reply: FastifyReply) {
	try {
		const matches = fetchAllMatches()
		return reply.status(200).send(matches)
	} catch (error) {
		console.error("Error retrieving matches:", error)
		return reply.status(500).send({ error: "Failed to retrieve matches." })
	}
}

/**
 * Retrieve matches for a specific user.
 */
export async function getMatchesByUserHandler(request: FastifyRequest<{ Params: { username: string } }>, reply: FastifyReply) {
	try {
		const { username } = request.params
		if (!usernameExists(username)) throw new Error("User does not exist.")
		const matches = fetchMatchesByUser(username)
		return reply.status(200).send(matches)
	} catch (error) {
		console.error("Error retrieving matches for user:", error)
		return reply.status(500).send({ error: "Failed to retrieve matches for user." })
	}
}

/**
 * Retrieve a match by its id
 */
export async function getMatchByIdHandler(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const {id} = request.params
	try {
		const match = getMatchById(id)
        if (!match) throw "no match"
		return reply.status(200).send(match)
	} catch (error) {
		console.error("Error retrieving match id ", id, ":", error)
		return reply.status(500).send({ error: "Failed to retrieve match with id of ", id })
	}
}
