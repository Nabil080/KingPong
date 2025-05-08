export type TournamentState = "firstRound" | "final" | "ending"

export class Tournament {
	public players: string[]
	public currentRound: TournamentState
	public matches: [string, string][]
	public winners: string[]
	public finalWinner?: string

	constructor(players: string[]) {
		if (players.length !== 4) {
			throw new Error("Tournament must have exactly 4 players.")
		}
		this.players = players
		this.currentRound = "firstRound"
		this.matches = []
		this.winners = []
		this.setupFirstRound()
	}

	// Randomly pair players for the first round
	private setupFirstRound() {
		this.players = this.players.sort(() => Math.random() - 0.5)

		this.matches = [
			[this.players[0], this.players[1]],
			[this.players[2], this.players[3]],
		]
	}

	public progressToNextRound() {
		if (this.currentRound === "firstRound") {
			this.currentRound = "final"
		} else if (this.currentRound === "final") {
			this.currentRound = "ending"
		}
	}
}
