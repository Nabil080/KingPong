import { Match } from "../types/match"

export function history(username: string, match: Match): string {
	const isWinner = match.winner === username
	const date = new Date(match.created_at!)
	const formattedDate = date.toLocaleDateString()
	const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

	return /* HTML */ `
		<div class="border-berry flex h-[55.9px] w-full items-center justify-between border-b px-5 py-4 last:border-b-0">
			<div class="flex items-center gap-4">
				<span class="${isWinner ? "text-green" : "text-red"} font-bold"> ${isWinner ? "✔" : "✘"} </span>
				<span class=""> ${match.player1} ${match.score1} - ${match.score2} ${match.player2} </span>
			</div>
			<div class="text-sm text-gray-400">
				<span>${formattedDate}</span>
				<span>${formattedTime}</span>
			</div>
		</div>
	`
}
