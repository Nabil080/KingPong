import Game from "../Game.js"
import { Paddle } from "./Paddle.js"

export class Ball {
	public game: Game

	public startingX: number
	public startingY: number
	public startingVelocityX: number
	public startingVelocityY: number
	// Ball properties
	public x: number
	public y: number
	public radius: number
	public velocityX: number
	public velocityY: number
	// Container for the ball
	public CanvasWidth: number
	public CanvasHeight: number

	constructor(game: Game, x: number, y: number, radius: number, velocityX: number, velocityY: number, CanvasWidth: number = 800, CanvasHeight: number = 600) {
		this.game = game
		this.startingX = x
		this.startingY = y
		this.startingVelocityX = velocityX
		this.startingVelocityY = velocityY
		this.x = x
		this.y = y
		this.radius = radius
		this.velocityX = velocityX
		this.velocityY = velocityY
		this.CanvasWidth = CanvasWidth
		this.CanvasHeight = CanvasHeight
	}

	// Updates the ball's position
	public update(paddle1: Paddle, paddle2: Paddle) {
		this.x += this.velocityX
		this.y += this.velocityY

		// Bounce off the top and bottom edges
		if (this.y - this.radius < 0 || this.y + this.radius > this.CanvasHeight) {
			this.velocityY *= -1
		}

		// Bounce off the paddles
		this.checkPaddleCollision(paddle1)
		this.checkPaddleCollision(paddle2)

		// Check for scoring and reset the ball
		if (this.x - this.radius < 0) {
			this.game.gameState.score2 += 1
			this.reset()
		} else if (this.x + this.radius > this.CanvasWidth) {
			this.game.gameState.score1 += 1
			this.reset()
		}
	}

	// Checks and handles collision with a paddle
	private checkPaddleCollision(paddle: Paddle) {
		// Check if the ball is within the paddle's horizontal and vertical bounds
		if (
			this.x - this.radius < paddle.x + paddle.width &&
			this.x + this.radius > paddle.x &&
			this.y + this.radius > paddle.y &&
			this.y - this.radius < paddle.y + paddle.height
		) {
			// Reverse the horizontal velocity
			this.velocityX *= -1

			// Adjust the ball's position to prevent sticking
			if (this.x < paddle.x) {
				this.x = paddle.x - this.radius // Place the ball to the left of the paddle
			} else {
				this.x = paddle.x + paddle.width + this.radius // Place the ball to the right of the paddle
			}

			// Add some randomness to the vertical velocity
			this.velocityY += (Math.random() - 0.5) * 2 // Randomize vertical direction slightly
			this.velocityY = Math.max(Math.min(this.velocityY, 5), -5) // Clamp the vertical velocity

			// Increase the ball's speed
			this.increaseSpeed()
		}
	}

	// Increases the ball's speed
	private increaseSpeed() {
		const speedMultiplier = 1.1 // Increase speed by 10%
		this.velocityX *= speedMultiplier
		this.velocityY *= speedMultiplier
	}

	public reset() {
		this.x = this.startingX
		this.y = this.startingY
		this.velocityX = this.startingVelocityX
		this.velocityY = this.startingVelocityY
	}
}
