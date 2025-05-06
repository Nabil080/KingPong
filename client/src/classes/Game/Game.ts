import { GameState } from "./GameState.js"
import { GameInputs } from "./GameInputs.js"
import { GameRenderer } from "./GameRenderer.js"
import { GameBot } from "./GameBot.js"

export default class Game {
	public gameState: GameState
	public gameInputs: GameInputs
	public gameRenderer: GameRenderer
	private gameBot1: GameBot | null = null
	private gameBot2: GameBot | null = null
	private updateState: boolean = true
	private renderState: boolean = true

	constructor(
		private canvas: HTMLCanvasElement,
		player1: string | null = null,
		player2: string | null = null,
	) {
		// Set fixed dimensions for the canvas (4:3 aspect ratio)
		this.canvas.width = 800
		this.canvas.height = 600

		this.gameState = new GameState(canvas)
		this.gameInputs = new GameInputs(this)
		this.gameRenderer = new GameRenderer(canvas, this.gameState)

		// Initialize GameBot for player 1 if no username is provided
		if (!player1) {
			this.gameBot1 = new GameBot(this.gameState, true)
		}

		// Initialize GameBot for player 2 if no username is provided
		if (!player2) {
			this.gameBot2 = new GameBot(this.gameState, false)
		}

		// Initialize inputs and start the game loop
		this.gameInputs.initialize()
		this.gameLoop()
	}

	// Main game loop
	private gameLoop() {
		if (this.updateState) {
			this.gameInputs.update() // Handle player inputs

			// Update GameBots if they exist
			if (this.gameBot1) this.gameBot1.update()
			if (this.gameBot2) this.gameBot2.update()

			this.gameState.update() // Update game state
		}

		this.gameRenderer.clearCanvas()
		if (this.renderState) {
			this.gameRenderer.render()
		}

		requestAnimationFrame(() => this.gameLoop())
	}

	public setUpdateState(state: boolean) {
		this.updateState = state
	}

	public setRenderState(state: boolean) {
		this.renderState = state
	}

	public toggleUpdateState() {
		this.updateState = !this.updateState
	}
}
