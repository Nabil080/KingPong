import { Match, createMatch, getAllMatches, getMatchesByUser } from "./matches.model.js"

/**
 * Create a new match.
 */
export function registerMatch(match: Match): void {
	createMatch(match)
}

/**
 * Retrieve all matches.
 */
export function fetchAllMatches(): Match[] {
	return getAllMatches()
}

/**
 * Retrieve matches for a specific user.
 */
export function fetchMatchesByUser(username: string): Match[] {
	return getMatchesByUser(username)
}
