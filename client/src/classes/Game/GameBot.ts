import { GameState } from "./GameState.js"

export class GameBot {
	private speed: number = 3 // Maximum speed at which the bot moves the paddle

	constructor(
		private gameState: GameState,
		private isLeftPaddle: boolean, // Determines if the bot controls the left or right paddle
	) {}

	// Updates the bot's paddle movement
	public update() {
		const paddle = this.isLeftPaddle ? this.gameState.paddle1 : this.gameState.paddle2
		const ball = this.gameState.ball

		// Check if the ball is moving toward the bot's paddle
		const ballMovingTowardBot = this.isLeftPaddle ? ball.velocityX < 0 : ball.velocityX > 0

		if (ballMovingTowardBot) {
			// Calculate the target position (center of the paddle should align with the ball's y position)
			const targetY = ball.y - paddle.height / 2

			// Smoothly move the paddle toward the target position
			if (paddle.y < targetY) {
				paddle.y += Math.min(this.speed, targetY - paddle.y) // Move down, but not beyond the target
			} else if (paddle.y > targetY) {
				paddle.y -= Math.min(this.speed, paddle.y - targetY) // Move up, but not beyond the target
			}

			// Ensure the paddle stays within the canvas bounds
			paddle.constrain()
		}
	}
}
