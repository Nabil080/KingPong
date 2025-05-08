import { Paddle } from "./Elements/Paddle.js"
import { Ball } from "./Elements/Ball.js"
import Game from "./Game.js"

export class GameState {
	public score1: number = 0
	public score2: number = 0
	public paddle1: Paddle
	public paddle2: Paddle
	public ball: Ball

	constructor(public game: Game, private canvas: HTMLCanvasElement) {
		const canvasWidth = canvas.width
		const canvasHeight = canvas.height

		// Initialize paddles
		this.paddle1 = new Paddle(10, canvasHeight / 2 - 50, canvasWidth * 0.02, canvasHeight * 0.2, canvasHeight)
		this.paddle2 = new Paddle(canvasWidth - 20, canvasHeight / 2 - 50, canvasWidth * 0.02, canvasHeight * 0.2, canvasHeight)

		// Initialize ball
		this.ball = new Ball(this.game, canvasWidth / 2, canvasHeight / 2, Math.min(canvasWidth, canvasHeight) * 0.02, 6, 6, canvasWidth, canvasHeight)
	}

	// Updates the game state
	public update() {
		this.ball.update(this.paddle1, this.paddle2)

		// Constrain paddles to the canvas
		this.paddle1.constrain()
		this.paddle2.constrain()
	}

	// Resets the game state
	public reset() {
		this.paddle1.reset()
		this.paddle2.reset()
		this.ball.reset()
	}
}
