import { App } from "../../classes/App.js"
import { renderNewTournament } from "./new_tournament.js"

// Render the tournament page based on the current round
export function renderTournament(app: App) {
	alert("Current state: " + app.tournament?.currentRound)

	switch (app.tournament?.currentRound) {
		case "firstRound":
			break
		case "final":
			break
		case "ending":
			break
		default:
			renderNewTournament(app)
	}
}
