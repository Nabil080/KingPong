import Game from "./Game.js"
import { GameState } from "./GameState.js"

export class GameRenderer {
	constructor(
		private canvas: HTMLCanvasElement,
		private game: Game,
		private ballColor: string = "#C10BD9",
		private paddleColor: string = "#C10BD9",
		private borderColor: string = "#C10BD9",
		private ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D,
		private gameState: GameState = game.gameState,
	) {}

	// Clears the canvas
	public clearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	// Renders the game state
	public render() {
		// Draw border
		this.drawBorder()

		// Draw paddles
		this.drawPaddles()

		// Draw ball
		this.drawBall()

		// Draw score
		this.drawScore()
	}

	drawBorder() {
		this.ctx.strokeStyle = this.borderColor
		this.ctx.lineWidth = 5
		this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height)
	}

	drawPaddles() {
		this.ctx.fillStyle = this.paddleColor
		this.ctx.fillRect(this.gameState.paddle1.x, this.gameState.paddle1.y, this.gameState.paddle1.width, this.gameState.paddle1.height)
		this.ctx.fillRect(this.gameState.paddle2.x, this.gameState.paddle2.y, this.gameState.paddle2.width, this.gameState.paddle2.height)
	}

	drawBall() {
		this.ctx.beginPath()
		this.ctx.arc(this.gameState.ball.x, this.gameState.ball.y, this.gameState.ball.radius, 0, 2 * Math.PI)
		this.ctx.fillStyle = this.ballColor
		this.ctx.fill()
		this.ctx.closePath()
	}

	pauseOverlay() {
		this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.font = "30px Arial"
		this.ctx.fillStyle = "#FFFFFF"
		this.ctx.textAlign = "center"
		this.ctx.fillText("Game Paused", this.canvas.width / 2, this.canvas.height / 2)
	}

	drawScore() {
		this.ctx.font = "30px Arial"
		this.ctx.fillStyle = "#FFFFFF"
		this.ctx.textAlign = "center"
		this.ctx.fillText(`
			${this.gameState.score1} - ${this.gameState.score2}
		`, this.canvas.width / 2, 50)
	}
}
