import { App } from "../classes/App.js"
import { baseButton } from "../components/buttons.js"

function themeButton(theme: string): string{
    return /* HTML */ `
        ${baseButton(theme, `data-theme='${theme}'`)}
    `
}

function themePopupHTML(): string{
	const allThemes = [
        "purple",
        "blue",
        "red",
        "green",
        "orange",
        "cyber",
        "pastel",
        "monochrome",
	]

	const currentTheme = document.body.getAttribute("data-theme") as string
	const otherThemes = allThemes.filter((theme) => theme !== currentTheme)

    return /* HTML */ `
		<section class="small-size container">
			<div class="mx-6 my-auto space-y-4 text-lg font-bold">
				<!-- Current theme first -->
                ${themeButton(currentTheme)}
				<!-- Other themes below -->
                ${otherThemes.map(theme => themeButton(theme)).join("")}
			</div>
		</section>
    `
}

function initButtonsEvents(app: App){
    document.querySelectorAll("button[data-theme]")
        .forEach(button => button.addEventListener('click',(e) => {
            const theme = button.getAttribute("data-theme") as string
            document.body.setAttribute("data-theme", theme)
            app.popup.close()
        })
    )
}

export function themePopup(app: App){
	app.popup.open(themePopupHTML())
	initButtonsEvents(app)
}
