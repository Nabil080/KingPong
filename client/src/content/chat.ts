import { App } from "../classes/App.js"
import { initPlayerButtonEvents, playerCard } from "../components/player_card.js"
import { routeParams } from "../types/routes.js"
import { UserData } from "../types/user.js"

function chatHTML(userData: UserData): string {
	const user = userData.user

	return /* HTML */ `
		<section class="small-size container">
			<div class="flex h-[57px] w-full text-sm font-bold">${playerCard(user, userData.relationship, false)}</div>
			<div class="flex h-[calc(100%-57px)] flex-col justify-between">
				<div id="chatMessages" data-dummy="true" class="no-scrollbar m-5 flex flex-col gap-5 overflow-y-auto text-sm">
					<div class="bg-berry ml-auto h-[32px] w-1/2"></div>
					<div class="bg-violet h-[32px] w-1/2"></div>
					<div class="bg-berry ml-auto h-[32px] w-1/2"></div>
					<div class="bg-violet h-[32px] w-1/2"></div>
					<div class="bg-berry ml-auto h-[32px] w-1/2"></div>
					<div class="bg-violet h-[32px] w-1/2"></div>
					<div class="bg-berry ml-auto h-[32px] w-1/2"></div>
				</div>
				<form id="chatForm" class="flex">
					<input
						type="text"
						id="messageInput"
						name="message"
						class="w-3/4 p-2 text-black focus:bg-gray-200 focus:outline-none"
						data-target-id="${user.id}"
						${user.status != "online" ? "disabled" : ""}
					/>
					<button type="submit" id="messageSubmit" class="bg-berry w-1/4 px-1 py-2" ${user.status != "online" ? "disabled" : ""}>
						Send
					</button>
				</form>
			</div>
		</section>
	`
}

export function renderChat(app: App, params: routeParams) {
	app.showBackground()
	// Check the id in the URL and if it's not the logged user
	const id = Number(params?.id)
	if (!id || id === app.loggedUser?.id) {
		app.router.notFound()
		return
	}

	// Check if the user exists
	const userData = app.cache.getUser(id)
	if (!userData) {
		app.router.notFound()
		return
	}

	app.changeContent(chatHTML(userData))

	// Add the stored messages in the container
	// wsClient.getConversation(Number(params.id))?.forEach((chat) => appendNewChatMessage(chat))
	initPlayerButtonEvents(app)
	// initChatEvents()
}
