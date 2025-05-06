import { App } from "../classes/App.js"
import { t } from "../translations/translations.js"
import { Match } from "../types/match.js"
import { routeParams } from "../types/routes.js"
import { connectPopup } from "./connect_popup.js"
import { UserData } from "../types/user.js"
import { createDurationPerGameChart, createMostPlayedUsersChart, createScorePerGameChart, createWinLossChart } from "../utils/charts.js"

/**
 * Returns the username from the URL parameters or from the logged-in user if there is none.
 * Opens the connect popup if no parameter or logged-in user.
 */
function getUsernameOrRedirect(app: App, params?: routeParams): string | null {
	if (!params?.username) {
		if (app.loggedUser) {
			return app.loggedUser.username
		} else {
			console.log("User not logged in, showing connect popup")
			connectPopup(app)
			return null
		}
	}
	return params.username
}

/**
 * Fetches user data from the cache and redirects to the 404 page if not found.
 */
function getUserDataOrRedirect(app: App, username: string): UserData | null {
	const userData = app.cache.getUserByUsername(username)
	if (!userData) {
		console.log("User not found, showing 404 page")
		app.router.notFound()
		return null
	}
	return userData
}

/**
 * Calculates statistics based on a user and their matches.
 */
function calculateStatistics(matches: Match[], username: string) {
	const nbGame = matches.length
	const win = matches.filter((match) => match.winner === username).length
	const loose = nbGame - win
	const totalScore = matches.reduce((total, match) => total + match.score1 + match.score2, 0)
	const averageScore = nbGame > 0 ? totalScore / nbGame : 0
	const totalDuration = matches.reduce((total, match) => total + match.duration, 0)
	const averageDuration = nbGame > 0 ? totalDuration / nbGame : 0

	const mostPlayedUsers = matches.reduce(
		(acc, match) => {
			const opponent = match.player1 === username ? match.player2 : match.player1
			acc[opponent] = (acc[opponent] || 0) + 1
			return acc
		},
		{} as Record<string, number>,
	)

	return { nbGame, win, loose, averageScore, averageDuration, mostPlayedUsers }
}

/**
 * Generates the HTML for the stats page.
 */
async function statsHTML(username: string, stats: ReturnType<typeof calculateStatistics>): Promise<string> {
	const { nbGame, win, loose, averageScore, averageDuration, mostPlayedUsers } = stats

	// Generate the most played users chart data
	const mostPlayedUsersHTML = Object.entries(mostPlayedUsers)
		.map(([user, count]) => `<li>${user}: ${count} games</li>`)
		.join("")

	const content = /* HTML */ `
		<section id="charts" class="center h-[calc(100vh-57px)] w-full">
			<div class="grid h-[700px] w-[1080px] grid-cols-3 grid-rows-2 gap-4">
				<article class="container col-span-1 row-span-1">
					<h3>${t("winLoss")}</h3>
					<p>${t("wins")}: ${win}</p>
					<p>${t("losses")}: ${loose}</p>
				</article>
				<article class="container col-span-2 row-span-1">
					<h3>${t("averageScorePerGame")}</h3>
					<p>${averageScore.toFixed(2)}</p>
				</article>
				<article class="container col-span-2 row-span-1">
					<h3>${t("averageDurationPerGame")}</h3>
					<p>${averageDuration.toFixed(2)} ${t("seconds")}</p>
				</article>
				<article class="container col-span-1 row-span-1">
					<h3>${t("mostPlayedUsers")}</h3>
					<ul>
						${mostPlayedUsersHTML || `<li>${t("noData")}</li>`}
					</ul>
				</article>
			</div>
		</section>
	`

	return content
}

export async function renderStats(app: App, params?: routeParams) {
	// Get the username or redirect if necessary
	const username = getUsernameOrRedirect(app, params)
	if (!username) return

	// Fetch user data or render 404 if the user does not exist
	const userData = getUserDataOrRedirect(app, username)
	if (!userData) return

	// Fetch matches from the cache
	const matches = await app.cache.getMatchesByUsername(username)

	// Calculate statistics
	const stats = calculateStatistics(matches, username)

	// Render the stats page
	const content = await statsHTML(username, stats)
	app.changeContent(content)
	createWinLossChart(stats.win, stats.loose)
	createScorePerGameChart(username, matches)
	createDurationPerGameChart(matches)
	createMostPlayedUsersChart(username, matches)
	app.hideBackground()
}
