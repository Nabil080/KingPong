import { App } from "../classes/App.js"
import { baseButton, coloredButton } from "../components/buttons.js"
import { setLang } from "../translations/translations.js"

const langButton = (key: string, label: string) =>
	/* HTML */ ` <button class="bg-violet hover:bg-berry w-full py-2 pl-[65px] text-left" data-lang="${key}">${label}</button>`

export function languagePopupHTML(): string {
	const content = /* HTML */ `
		<section class="small-size container">
			<div class="mx-6 my-auto space-y-4 text-lg font-bold">
				${coloredButton("🇫🇷 Français", "bg-violet", "data-lang='fr'")} ${coloredButton("🇬🇧 English", "bg-violet", "data-lang='en'")}
				${coloredButton("🇨🇳 中文", "bg-violet", "data-lang='ch'")} ${coloredButton("🇱🇰 தமிழ்", "bg-violet", "data-lang='ta'")}
				${coloredButton("🇩🇿 عربي", "bg-violet", "data-lang='ar'")}
			</div>
		</section>
	`
	return content
}

function changeLanguage(app: App, key: string) {
	setLang(key)
	app.popup.close()
	app.navbar.updateNavbarLanguageFlag()
	app.router.renderCurrentPage()
}

function initChangeLanguageEvents(app: App) {
	const buttons = document.querySelectorAll("[data-lang]")
	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			const key = button.getAttribute("data-lang")
			if (key) {
				changeLanguage(app, key)
			}
		})
	})
}
export function languagePopup(app: App) {
	app.popup.open(languagePopupHTML())
	initChangeLanguageEvents(app)
}
