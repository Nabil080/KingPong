import { GameState } from "./GameState.js"
import { GameInputs } from "./GameInputs.js"
import { GameRenderer } from "./GameRenderer.js"
import { GameBot } from "./GameBot.js"
import { User } from "../../types/user.js"

export type GameUserType = User | GameBot | string | null

export default class Game {
	public gameState: GameState
	public gameInputs: GameInputs
	public gameRenderer: GameRenderer
	public updateState: boolean = false
	public renderState: boolean = false
	public player1: GameUserType
	public player2: GameUserType

	constructor(
		public canvas: HTMLCanvasElement,
		player1: GameUserType = "",
		player2: GameUserType = "",
	) {
		this.canvas.width = 1216
		// Calculate height based on the aspect ratio (16/9)
		this.canvas.height = Math.floor(this.canvas.width / (16 / 9))

		this.gameState = new GameState(this, canvas)
		this.gameInputs = new GameInputs(this)
		this.gameRenderer = new GameRenderer(canvas, this)

		// Instanciate the bots if the player isnt a human
		this.player1 = player1 ?? new GameBot(this.gameState, true, "Bot_1")
		this.player2 = player2 ?? new GameBot(this.gameState, false, "Bot_2")

		console.log("Game initialized with players:", this.player1, this.player2)

		// Initialize inputs and start the game loop
		this.gameInputs.initialize()
		this.gameLoop()
	}

	// Main game loop
	private gameLoop() {
		this.gameRenderer.clearCanvas() // Clear the canvas at the start of each frame

		if (this.updateState) {
			this.gameInputs.update() // Handle player inputs

			// Update GameBots if they exist
			if (this.player1 instanceof GameBot) this.player1.update()
			if (this.player2 instanceof GameBot) this.player2.update()

			this.gameState.update() // Update game state
		}

		if (this.renderState) {
			this.gameRenderer.render() // Render the game
		}

		if (!this.updateState && this.renderState) {
			// Render the paused overlay if rendering but not updating
			this.gameRenderer.pauseOverlay()
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
