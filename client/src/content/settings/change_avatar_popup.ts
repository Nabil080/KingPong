import { App } from "../../classes/App.js"
import { baseButton, popupLink } from "../../components/buttons.js"
import { errorDiv } from "../../components/inputs.js"
import { t } from "../../translations/translations.js"
import { hideError, validateAvatarInput, showError } from "../../utils/forms.js"

export function changeAvatarPopup(app: App) {
	app.popup.open(changeAvatarPopupHTML())
	changeAvatarFormEvent(app)
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
