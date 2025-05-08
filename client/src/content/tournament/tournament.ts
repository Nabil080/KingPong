import { App } from "../../classes/App.js"
import { renderTournamentFirstRound } from "./firstRound.js"
import { renderNewTournament } from "./new_tournament.js"

// Render the tournament page based on the current round
export function renderTournament(app: App) {
	switch (app.tournament?.currentRound) {
		case "firstRound":
			renderTournamentFirstRound(app)
			break
		case "final":
			break
		case "ending":
			break
		default:
			renderNewTournament(app)
	}
}
