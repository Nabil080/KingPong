import { App } from "../classes/App.js"
import { initPlayerButtonEvents, playerCard } from "../components/player_card.js"
import { t } from "../translations/translations.js"
import { UserData } from "../types/user.js"
import { attachTabEventListener, tabItem } from "../utils/tabs.js"
import { connectPopup } from "./connect_popup.js"

type playerListTab = "all" | "friends" | "online" | "offline" | "blocked"

export function playersTabContentHTML(app: App, tab: playerListTab): string {
	let users: UserData[] = []
	if (tab === "all") users = app.cache.getAllOtherUsers()
	else if (tab === "friends") users = app.cache.getAllFriends()
	else if (tab === "blocked") users = app.cache.getAllBlockedUsers()

	return (
		users.map((userData) => playerCard(userData.user, userData.relationship, true)).join("") ||
		`<div class="h-full center "> ${t("noPlayers")}</div>`
	)
}

export function playersListHTML(app: App, tab: playerListTab): string {
	return /* HTML */ `
		<section class="small-size container">
			<div data-tab="players-list" class="flex h-[57px] w-full text-xl font-bold">
				${tabItem("all", t("players"), tab === "all", "w-1/2")} ${tabItem("friends", t("friends"), tab === "friends", "w-1/2")}
			</div>
			<div class="p-2">
				<input
					id="player-search"
					type="text"
					placeholder="${t("search")}"
					class="focus:ring-berry w-full border px-3 py-2 focus:outline-none focus:ring-2"
				/>
			</div>
			<div data-tab-content="players-list" id="players-list" class="no-scrollbar overflow-y-scroll text-sm">
				${playersTabContentHTML(app, tab)}
			</div>
		</section>
	`
}

export function initSearchInputEvent() {
	const input = document.getElementById("player-search") as HTMLInputElement
	const playerList = document.getElementById("players-list")

	if (input && playerList) {
		input.addEventListener("input", () => {
			const searchString = input.value.toLowerCase()
			const cards = playerList.querySelectorAll("[data-player-card]")

			cards.forEach((card) => {
				const name = (card.getAttribute("data-username") || "").toLowerCase()
				// Hide if the username does not include the search input
				card.classList.toggle("hidden", !name.includes(searchString))
			})
		})
	}
}

export function renderPlayers(app: App): void {
	// Default tab
	app.changeContent(playersListHTML(app, "all"))
	initPlayerButtonEvents(app)
	initSearchInputEvent()

	// Tab switching
	attachTabEventListener<playerListTab>("[data-tab]", "[data-tab-content]", (tabName, contentElement) => {
		if (tabName === "friends" && !app.loggedUser) connectPopup(app)
		else {
			contentElement.innerHTML = playersTabContentHTML(app, tabName)
			initPlayerButtonEvents(app)
		}
	})

	app.showBackground()
}
