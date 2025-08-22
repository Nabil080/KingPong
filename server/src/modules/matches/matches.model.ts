import db from "../../core/db.js"

export interface Match {
	id?: number
	player1: string
	player2: string
	winner: string
	score1: number
	score2: number
	duration: number
	created_at?: string
    inputs: string
}

/**
 * Create a new match.
 */
export function createMatch(match: Match): void {
	console.log("Creating match:", match)
	return db
		.prepare(
			`
        INSERT INTO matches (player1, player2, winner, score1, score2, duration, inputs)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
		)
		.run(match.player1, match.player2, match.winner, match.score1, match.score2, match.duration, match.inputs)
}

/**
 * Retrieve all matches.
 */
export function getAllMatches(): Match[] {
	return db.prepare("SELECT * FROM matches").all() as Match[]
}

/**
 * Retrieve matches for a specific user.
 */
export function getMatchesByUser(username: string): Match[] {
	return db
		.prepare(
			`
        SELECT * FROM matches
        WHERE player1 = ? OR player2 = ?
    `,
		)
		.all(username, username) as Match[]
}

export function getMatchById(id: number): Match {
	return db
		.prepare(
			`
        SELECT * FROM matches
        WHERE id = ?
    `,
		)
		.get(id) as Match
}
