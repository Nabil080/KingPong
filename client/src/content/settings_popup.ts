import { App } from "../classes/App.js"
import { baseButton, link, popupLink } from "../components/buttons.js"
import { errorDiv, textInput } from "../components/inputs.js"
import { t } from "../translations/translations.js"
import { hideError, USER_LEN, showError, validateAvatarInput } from "../utils/forms.js"
import { getAvatarPath } from "../utils/utils.js"

function settingsPopupHTML(app: App): string {
	const user = app.loggedUser
	if (!user) {
		return ""
	}

	const content = /* HTML */ `
		<section class="small-size container items-center justify-center gap-4">
			<div class="flex flex-col items-center">
				<img src="${getAvatarPath(user.avatar)}" alt="Avatar actuel" class="avatar h-24 w-24" />
				<h1 class="mt-2 text-2xl font-bold">${user.username}</h1>
			</div>
			<div class="flex w-full flex-col space-y-4 px-6">
				${baseButton(t("modifyName"), "data-popup='change-username'")} ${baseButton(t("modifyAvatar"), "data-popup='change-avatar'")}
				${baseButton(t("modifyPassword"), "data-popup='change-password'")} ${baseButton(t("confidentiality"), "data-popup='confidentiality'")}
				<div class="w-full text-center text-sm">
					<button id="logout-button" class="hover-effect text-center text-lg font-medium"> ${t("logout")} </a>
				</div>
			</div>
		</section>
	`

	return content
}

function changeUsernamePopupHTML(): string {
	return /* HTML */ `
		<section id="change-username" class="small-size container items-center justify-center gap-4">
			<form id="change-username-form" class="relative flex w-full flex-col gap-4 px-6">
				${errorDiv()}
				<h1 class="mt-2 text-center">${t("changeName")}</h1>
				${textInput("new-username", t("newName"))} ${baseButton(t("confirmOptions"), "type='submit'")}
			</form>
			${popupLink("settings", t("back"))}
		</section>
	`
}

function changeAvatarPopupHTML(): string {
	return /* HTML */ `
		<section id="change-avatar" class="small-size container items-center justify-center gap-4">
			<form id="change-avatar-form" class="relative flex w-full flex-col gap-4 px-6">
				${errorDiv()}
				<h1 class="mt-2 text-center">${t("changeAvatar")}</h1>
				<div>
					<div class="flex w-full items-center">
						<span
							class="flex h-full flex-grow items-center truncate border-gray-300 bg-white px-4 py-1.5 text-gray-400"
							id="fileNameDisplay"
							>${t("avatar")}</span
						>
						<button
							type="button"
							class="bg-berry h-full px-4 py-1.5 duration-300 hover:bg-opacity-80"
							onclick="document.getElementById('hiddenFile').click()"
						>
							${t("browse")}
						</button>
						<input
							type="file"
							id="hiddenFile"
							name="new-avatar"
							accept="image/*"
							class="hidden"
							onchange="document.getElementById('fileNameDisplay').textContent = this.files[0] ? this.files[0].name : 'Avatar'"
						/>
					</div>
				</div>
				${baseButton(t("confirmOptions"), "type='submit'")}
			</form>
			${popupLink("settings", t("back"))}
		</section>
	`
}

function changeUsernameFormEvent(app: App) {
	const form = document.getElementById("change-username-form") as HTMLFormElement
	form?.addEventListener("submit", async (event) => {
		event.preventDefault()
		const usernameInput = document.querySelector("input[name='new-username']") as HTMLInputElement
		const newUsername = usernameInput.value.trim()

		hideError(form)
		try {
			if (!newUsername) {
				throw t("allField")
			} else if (newUsername.length < USER_LEN.min) {
				throw t("nameMinimum")
			} else if (newUsername.length > USER_LEN.max) {
				throw t("nameMaximum")
			}

			const response = await app.server.updateUsername(newUsername)
			if (response.error) {
				throw response.error
			}

			app.loggedUser!.username = newUsername
			app.navbar.updateNavbarLoggedState()
			settingsPopup(app)
		} catch (error: any) {
			showError(form, error)
		}
	})
}

export function settingsPopup(app: App) {
	app.popup.open(settingsPopupHTML(app))
	// Logout button
	document.getElementById("logout-button")?.addEventListener("click", () => app.server.logoutRequest())
}

export function changeUsernamePopup(app: App) {
	app.popup.open(changeUsernamePopupHTML())
	changeUsernameFormEvent(app)
}

export function changeAvatarPopup(app: App) {
	app.popup.open(changeAvatarPopupHTML())
	changeAvatarFormEvent(app)
}

function changeAvatarFormEvent(app: App) {
	const form = document.getElementById("change-avatar-form") as HTMLFormElement
	form?.addEventListener("submit", async (event) => {
		event.preventDefault()
		const avatarInput = document.querySelector("input[name='new-avatar']") as HTMLInputElement

		hideError(form)
		try {
			if (!avatarInput.files || avatarInput.files.length === 0) {
				throw t("selectAvatar")
			}

			validateAvatarInput(avatarInput.files[0])

			const response = await app.server.updateAvatar(avatarInput.files[0])
			if (response.error) {
				throw response.error
			}
			// update cached avatar
			app.loggedUser!.avatar = response.filename
			// TODO: Use the cache and a timestamp to fetch the new avatar without reloading the page
			location.reload()
		} catch (error) {
			showError(form, error as string)
		}
	})
}
