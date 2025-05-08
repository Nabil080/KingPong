import { App } from "./App.js"
import Game from "./Game/Game.js"

export default class Background {
	private root: HTMLElement
	private canvas: HTMLCanvasElement
	private game: Game | null = null

	constructor(private app: App) {
		// Create the root element
		this.root = document.createElement("div")
		this.root.id = "background"
		this.root.className = "absolute left-0 w-full pointer-events-none center flex flex-col"

		// Create the background canvas
		this.canvas = document.createElement("canvas")

		// Append the canvas to the body
		this.root.appendChild(this.canvas)
		document.body.appendChild(this.root)
	}

	render() {
		this.root.style.top = this.app.navbar.root.clientHeight - 1 + "px"
		this.root.style.height = `${window.innerHeight - this.app.navbar.root.clientHeight - 1}px`
		// Initialize the game
		this.game = new Game(this.canvas)
		this.game.setUpdateState(true)
	}

	// Show the background (start drawing)
	show() {
		this.root.style.display = "flex"
		this.app.content.root.style.position = "relative"
		this.app.content.root.style.zIndex = "1"
		this.app.content.root.style.backdropFilter = "blur(5px)"
		if (this.game) {
			this.game.setRenderState(true)
		}
	}

	// Hide the background (stop drawing)
	hide() {
		this.root.style.display = "none"
		this.app.content.root.style.backdropFilter = "none"
		if (this.game) {
			this.game.setRenderState(false)
		}
	}
}
