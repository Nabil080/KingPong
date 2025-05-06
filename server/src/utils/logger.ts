export function log(message: string) {
	//console.log(`[${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}] ${message}`)
}

export function error(message: string) {
	console.error(`[${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}] ${message}`)
}
