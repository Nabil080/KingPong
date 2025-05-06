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
		this.root.className = "absolute left-0 w-full pointer-events-none center"
		// Score div
		this.root.innerHTML = /* HTML */ `
			<div id="score" class="absolute top-0 flex w-[800px] items-center justify-between px-4 py-2">
				<div class="w-fit text-center text-2xl font-bold">
					<div id="player1">Player 1</div>
					<div id="score1">0</div>
				</div>
				<div class="w-fit text-center text-2xl font-bold">
					<div id="player2">Player 2</div>
					<div id="score2">0</div>
				</div>
			</div>
		`

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
	}

	// Show the background (start drawing)
	show() {
		if (!this.game) return
		this.game.setRenderState(true)
		this.app.content.root.style.position = "relative"
		this.app.content.root.style.zIndex = "1"
		// this.app.content.root.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
		// this.app.content.root.style.backdropFilter = "blur(5px)"
	}

	// Hide the background (stop drawing)
	hide() {
		if (!this.game) return
		this.game.setRenderState(false)
		this.app.content.root.style.backgroundColor = "transparent"
		this.app.content.root.style.backdropFilter = "none"
	}
}
