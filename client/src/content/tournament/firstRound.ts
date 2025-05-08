import { App } from "../../classes/App.js"
import { Tournament } from "../../classes/Tournament.js"
import { customButton } from "../../components/buttons.js"
import { renderTournament } from "./tournament.js"

function tournamentMatchupElement(player1: string = "?", player2: string = "?"): string {
	return /* html */ `
    <article class="bg-eerie border-purple flex w-full items-center justify-center gap-6 border-2 p-5 shadow-inner">
        <span class="font-semibold ${player1 == "?" ? "opacity-60" : ""}">${player1}</span>
        <div class="${player1 == "?" && player2 == "?" ? "opacity-60" : ""}">
            <img src="/assets/images/VS-image.png" alt="VS" class="h-12 w-12 transform transition-transform duration-300 hover:scale-110" />
            <div class="bg-violet opacity-40 blur"></div>
        </div>
        <span class="font-semibold ${player2 == "?" ? "opacity-60" : ""}">${player2}</span>
    </article>
    `
}

function firstRoundHTML(tournament: Tournament): string {
	return /* HTML */ `
		<section class="large-size from-eerie to-purple center container h-full w-full gap-6 bg-gradient-to-b p-8 text-xl text-white shadow-2xl">
			${tournamentMatchupElement(tournament.players[0], tournament.players[1])}
			${tournamentMatchupElement(tournament.players[2], tournament.players[3])}
			${tournamentMatchupElement(tournament.winners[0], tournament.winners[1])}
			${customButton("PLAY", "w-auto bg-berry !text-2xl !font-bold !px-10 !py-4")}
		</section>
	`
}

export function renderTournamentFirstRound(app: App) {
	if (app.tournament?.currentRound != "firstRound") renderTournament(app) // Just in case

	app.changeContent(firstRoundHTML(app.tournament!))
}
