import Game from "./Game.js"

export class GameInputs {
	private keys: { [key: string]: boolean } = {} // Tracks the state of keys

	constructor(private game: Game) {}

	// Initializes input listeners
	public initialize() {
		window.addEventListener("keydown", (event) => this.handleKeyDown(event))
		window.addEventListener("keyup", (event) => this.handleKeyUp(event))
	}

	// Handles keydown events
	private handleKeyDown(event: KeyboardEvent) {
		this.keys[event.key] = true // Mark the key as pressed
	}

	// Handles keyup events
	private handleKeyUp(event: KeyboardEvent) {
		this.keys[event.key] = false // Mark the key as released
	}

	// Updates paddle movement based on key states
	public update() {
		if (this.keys["w"]) {
			this.game.gameState.paddle1.moveUp()
		}
		if (this.keys["s"]) {
			this.game.gameState.paddle1.moveDown()
		}
		if (this.keys["ArrowUp"]) {
			this.game.gameState.paddle2.moveUp()
		}
		if (this.keys["ArrowDown"]) {
			this.game.gameState.paddle2.moveDown()
		}
		if (this.keys["Escape"]) {
			this.game.gameState.reset()
		}
	}
}
