import Game from "./Game.js"

export type ReplayEntryType = {
    timestamp: number
    entry: ReplayInputType | ReplayBallAngleType
}

export type ReplayInputType = {
    type: "input"
    player: 1 | 2
    key: string
    pressed: boolean
}

export type ReplayBallAngleType = {
    type: "ballAngle"
    dx: number
    dy: number
}

export class GameInputs {
	static TRACKED_KEYS: string[] = ["w", "s", "ArrowUp", "ArrowDown"] // List of keys to track
	private keys: { [key: string]: boolean } = {} // Tracks the state of keys
	private replay1keys: { [key: string]: boolean } = {} // Tracks the state of keys
	private replay2keys: { [key: string]: boolean } = {} // Tracks the state of keys
    public  stored: ReplayEntryType[] = []

	constructor(private game: Game) {
		this.initialize()
	}

	// Initializes input listeners
	public initialize() {
		window.addEventListener("keydown", (event) => this.handleKeyDown(event))
		window.addEventListener("keyup", (event) => this.handleKeyUp(event))
	}

	// Handles keydown events
	private handleKeyDown(event: KeyboardEvent) {
		if (!GameInputs.TRACKED_KEYS.includes(event.key)) return // Ignore untracked keys
		this.keys[event.key] = true // Mark the key as pressed

		// Send the key event to the server
		if (this.game.currentStep === "playing" && this.game.gameMode === "remote") {
			this.game.app.websocket.sendKeyEvent(event.key, true)
		}
	}

	// Handles keyup events
	private handleKeyUp(event: KeyboardEvent) {
		if (!GameInputs.TRACKED_KEYS.includes(event.key)) return // Ignore untracked keys
		this.keys[event.key] = false // Mark the key as released

		// Send the key event to the server
		if (this.game.currentStep === "playing" && this.game.gameMode === "remote") {
			this.game.app.websocket.sendKeyEvent(event.key, false)
		}
	}

	// Updates paddle movement based on game mode and key states
	public update() {
		// Don't update if the game is not running
		if (this.game.currentStep !== "playing") return

		// Handle inputs based on game mode
		if (this.game.gameMode === "local" || this.game.gameMode === "tournament") {
			this.handleLocalInputs()
		} else if (this.game.gameMode === "remote") {
			this.handleRemoteInputs()
		} else if (this.game.gameMode === "replay") {
            this.handleReplayInputs()
        }
	}

	// Handles inputs for local game mode
	private handleLocalInputs() {
		const player1IsHuman = this.game.player1?.type !== "bot"
		const player2IsHuman = this.game.player2?.type !== "bot"

		let leftPaddle = null
		let rightPaddle = null

		if (player1IsHuman && !player2IsHuman) {
			leftPaddle = rightPaddle = this.game.state.paddle1
		} else if (!player1IsHuman && player2IsHuman) {
			leftPaddle = rightPaddle = this.game.state.paddle2
		} else {
			leftPaddle = player1IsHuman ? this.game.state.paddle1 : null
			rightPaddle = player2IsHuman ? this.game.state.paddle2 : null
		}

		if (this.keys["w"]) leftPaddle?.moveUp()
		if (this.keys["s"]) leftPaddle?.moveDown()
		if (this.keys["ArrowUp"]) rightPaddle?.moveUp()
		if (this.keys["ArrowDown"]) rightPaddle?.moveDown()
	}

	// Handles inputs for remote game mode
	private handleRemoteInputs() {
		if (this.game.player1?.type !== "remote" || this.game.player2?.type !== "remote") return

		// Control the left or right paddle based on the logged-in user
        let paddle;
        if (this.game.app.loggedUser?.id === this.game.player1?.user.id) paddle = this.game.state.paddle1
        else if (this.game.app.loggedUser?.id === this.game.player2?.user.id) paddle = this.game.state.paddle2
        else return // Spectator has no controls

		if (this.keys["w"]) {
			paddle.moveUp()
		}
		if (this.keys["s"]) {
			paddle.moveDown()
		}
		if (this.keys["ArrowUp"]) {
			paddle.moveUp()
		}
		if (this.keys["ArrowDown"]) {
			paddle.moveDown()
		}
	}

    private handleReplayInputs() {
        const currentTime = this.game.getCurrentTime();
        const inputs = this.game.inputs.stored;

        console.log(currentTime)

        while (inputs.length > 0 && inputs[0].timestamp <= currentTime) {
            const input = inputs.shift()!.entry; // Remove and get the first input
            if (input.type === "input")
            {
                if (input.player === 1) {
                    this.replay1keys[input.key] = input.pressed;
                } else if (input.player === 2) {
                    this.replay2keys[input.key] = input.pressed;
                }
            } else if (input.type === "ballAngle"){
                this.game.state.ball.dx = input.dx
                this.game.state.ball.dy = input.dy
            }
        }

        if (this.replay1keys["w"] || this.replay1keys["ArrowUp"]) this.game.state.paddle1.moveUp();
        if (this.replay1keys["s"] || this.replay1keys["ArrowDown"]) this.game.state.paddle1.moveDown();
        if (this.replay2keys["w"] || this.replay2keys["ArrowUp"]) this.game.state.paddle2.moveUp();
        if (this.replay2keys["s"] || this.replay2keys["ArrowDown"]) this.game.state.paddle2.moveDown();
    }

}
