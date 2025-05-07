import { App } from "../classes/App.js"
import { history } from "../components/history.js"
import { t } from "../translations/translations.js"
import { Match } from "../types/match.js"
import { routeParams } from "../types/routes.js"
import { connectPopup } from "./connect_popup.js"
import { UserData } from "../types/user.js"

export async function renderHistory(app: App, params?: routeParams) {
	// Get the username or redirect if necessary
	const username = getUsernameOrRedirect(app, params)
	if (!username) return

	// Fetch user data or render 404 if the user does not exist
	const userData = getUserDataOrRedirect(app, username)
	if (!userData) return

	// Fetch matches from the cache
	const matches = await app.cache.getMatchesByUsername(username)

	// Render the history page
	app.changeContent(await historyHTML(username, matches))
	app.hideBackground()
}

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
 * Generates the HTML for the history page.
 */
export async function historyHTML(username: string, matches: Match[]): Promise<string> {
	// Generate the match history HTML
	const matchHistories = matches.map((match) => history(username, match)).join("")

	const center = /* HTML */ `
		<section class="large-size container">
			<div class="custom-scrollbar flex h-full flex-col overflow-y-auto text-sm">
				${matchHistories || `<p class="text-center my-auto">${t("noMatchesFound")}</p>`}
			</div>
		</section>
	`

	return center
}
