export class Paddle {
	public x: number
	public y: number
	public width: number
	public height: number
	public speed: number = 5
	public canvasHeight: number

	constructor(x: number, y: number, width: number, height: number, canvasHeight: number) {
		this.canvasHeight = canvasHeight
		this.x = x
		this.y = canvasHeight / 2 - height / 2
		this.width = width
		this.height = height
	}

	// Moves the paddle up
	public moveUp() {
		this.y -= this.speed
	}

	// Moves the paddle down
	public moveDown() {
		this.y += this.speed
	}

	// Ensures the paddle stays within the canvas bounds
	public constrain() {
		if (this.y < 0) this.y = 0
		if (this.y + this.height > this.canvasHeight) this.y = this.canvasHeight - this.height
	}

	// Resets the paddle to its initial position
	public reset() {
		this.y = this.canvasHeight / 2 - this.height / 2
		this.x = this.x === 10 ? 10 : this.x // Ensure paddle1 starts at x=10
		this.x = this.x === 20 ? 20 : this.x // Ensure paddle2 starts at x=20
	}
}
