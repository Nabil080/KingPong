import { GameUserType } from "../classes/Game/Game.js"
import { GameBot } from "../classes/Game/GameBot.js"
import Server from "../classes/Server.js"

export function getAvatarPath(avatar: string): string {
	if (avatar === "default.png") {
		return "/assets/images/avatars/default.png"
	} else {
		return `${Server.URL}/avatars/${avatar}`
	}
}

export function getPlayerAvatarPath(player: GameUserType): string {
	if (typeof player === "string") {
		return "/assets/images/avatars/default.png"
	} else if (player instanceof GameBot) {
		return "/assets/images/avatars/bot.png"
	} else if (player?.avatar){
		return getAvatarPath(player.avatar)
	} else {
		return "/assets/images/avatars/unknown.jpg"
	}
}

export function getPlayerName(player: GameUserType): string {
	if (typeof player === "string") {
		return player
	} else if (player?.username) {
		return player.username
	} else {
		return "Unknown"
	}
}

export function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const remainingSeconds = seconds % 60
	return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}
