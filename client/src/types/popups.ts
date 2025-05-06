import { App } from "../classes/App.js"
import { connectPopup } from "../content/connect_popup.js"
import { languagePopup } from "../content/language_popup.js"
import { registerPopup } from "../content/register_popup.js"
import { changeUsernamePopup, settingsPopup } from "../content/settings_popup.js"

export type popupHandler = (app: App) => void

export type popupRoutes = {
	id: string
	handler: popupHandler
}

export const popups: popupRoutes[] = [
	{ id: "connect", handler: connectPopup },
	{ id: "register", handler: registerPopup },
	{ id: "language", handler: languagePopup },
	{ id: "settings", handler: settingsPopup },
	{ id: "confidentiality", handler: settingsPopup }, // TODO: Add confidentiality popup
	{ id: "change-username", handler: changeUsernamePopup }, // TODO: Add change name popup
	{ id: "change-avatar", handler: settingsPopup }, // TODO: Add change avatar popup
	{ id: "change-password", handler: settingsPopup }, // TODO: Add change password popup
	{ id: "blocked-users", handler: settingsPopup }, // TODO: Add blocked users popup
	{ id: "delete-account", handler: settingsPopup }, // TODO: Add delete account popup
]
