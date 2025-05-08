import { App } from "../../classes/App.js"
import { Tournament } from "../../classes/Tournament.js"
import { baseButton } from "../../components/buttons.js"
import { errorDiv, textInput } from "../../components/inputs.js"
import { t } from "../../translations/translations.js"
import { USER_LEN, showError } from "../../utils/forms.js"

function newTournamentHTML(): string {
	return /* html */ `
        <section id="tournament" class="small-size container">
            <div class="flex h-full items-center justify-center text-sm">
                <form id="tournament-form" class="flex flex-col gap-2">
                    ${errorDiv()}
                    ${textInput("player1", t("player1"), "required value='Kiwi'")}
                    ${textInput("player2", t("player2"), "required value='Nabil'")}
                    ${textInput("player3", t("player3"), "required value='David'")}
                    ${textInput("player4", t("player4"), "required value='Coco'")}
                    ${baseButton(t("create"), "type='submit'")}
                </form>
            </div>
        </section>
    `
}

function validatePlayers(players: string[]): string | null {
	// Check if all fields are filled
	if (players.some((player) => !player.trim())) {
		return t("allField")
	}

	// Check if any name exceeds the maximum length
	if (players.some((player) => player.length > USER_LEN.max)) {
		return t("nameMaximum")
	}

	// Check for duplicate names
	const uniquePlayers = new Set(players)
	if (uniquePlayers.size !== players.length) {
		return t("nameTaken")
	}

	return null
}

function initTournament(app: App) {
	const form = document.getElementById("tournament-form") as HTMLFormElement
	if (!form) {
		console.error("Tournament form not found")
		return
	}

	form.addEventListener("submit", (e) => {
		e.preventDefault()
		// Collect player inputs
		const players = [
			(document.querySelector("[name='player1']") as HTMLInputElement).value,
			(document.querySelector("[name='player2']") as HTMLInputElement).value,
			(document.querySelector("[name='player3']") as HTMLInputElement).value,
			(document.querySelector("[name='player4']") as HTMLInputElement).value,
		]

		// Validate players
		const error = validatePlayers(players)
		if (error) {
			showError(form, error)
			return
		}

		app.tournament = new Tournament(players)
		app.router.renderCurrentPage()
	})
}

export function renderNewTournament(app: App) {
	app.changeContent(newTournamentHTML())
	initTournament(app)
}
