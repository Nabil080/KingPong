import { App } from "../classes/App.js"
import { baseButton } from "../components/buttons.js"

function themeButton(theme: string): string {
	return /* HTML */ ` ${baseButton(theme, `data-theme='${theme}'`)} `
}

function themePopupHTML(): string {
	const allThemes = ["purple", "blue", "red", "green", "orange", "pastel", "monochrome"]

	const currentTheme = document.body.getAttribute("data-theme") as string
	const otherThemes = allThemes.filter((theme) => theme !== currentTheme)

	return /* HTML */ `
		<section class="small-size container">
			<div class="mx-6 my-auto space-y-4 text-lg font-bold">
				<!-- Current theme first -->
				<div>${themeButton(currentTheme)}</div>
				<!-- Other themes below -->
				<div class="grid grid-cols-2 gap-4">${otherThemes.map((theme) => themeButton(theme)).join("")}</div>
			</div>
		</section>
	`
}

function initButtonsEvents(app: App) {
	document.querySelectorAll("button[data-theme]").forEach((button) =>
		button.addEventListener("click", (e) => {
			const theme = button.getAttribute("data-theme") as string
			document.body.setAttribute("data-theme", theme)
			app.popup.close()
			app.game?.renderer.updateColor()
			app.background.game.renderer.updateColor()
			localStorage.setItem("theme", theme)
		}),
	)
}

export function themePopup(app: App) {
	app.popup.open(themePopupHTML())
	initButtonsEvents(app)
}
