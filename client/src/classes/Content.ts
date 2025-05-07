import { App } from "./App.js"
import Game from "./Game/Game.js"

export default class Content {
	public root: HTMLElement = document.createElement("main")

	constructor(private app: App) {
		// Create the main content element
		this.root = document.createElement("main")
		this.root.id = "content-root"
		this.root.className = `flex items-center justify-center`
		this.root.innerHTML = "Default content"
	}

	render() {
		this.root.style.height = `${window.innerHeight - this.app.navbar.root.clientHeight - 1}px`
		// Append the main content element to the body
		document.body.appendChild(this.root)
	}

	// Change the content of the main element
	setContent(content: string) {
		if (this.root) {
			this.root.innerHTML = content
		}
	}

	loader() {
		this.root.innerHTML = /* HTML */ `
			<div class="flex h-full w-full items-center justify-center">
				<div class="border-t-berry h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-white"></div>
			</div>
		`
	}
}
