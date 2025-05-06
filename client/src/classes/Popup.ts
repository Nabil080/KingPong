import { popupHandler, popups } from "../types/popups.js"
import { App } from "./App.js"

export default class Popup {
	private popupElement: HTMLElement | null = null
	private popupHandlers: Map<string, popupHandler> = new Map()

	constructor(private app: App) {
		// Register default popups
		popups.forEach((popup) => {
			this.registerPopup(popup.id, popup.handler)
		})

		// Listen for clicks on elements with data-popup attributes
		document.addEventListener("click", (event) => {
			const target = event.target as HTMLElement
			if (target && target.hasAttribute("data-popup")) {
				const popupId = target.getAttribute("data-popup")
				if (popupId && this.popupHandlers.has(popupId)) {
					// Call the corresponding popup handler
					this.popupHandlers.get(popupId)?.(this.app)
				}
			}
		})
	}

	/**
	 * Registers a popup handler for a specific ID.
	 * @param id The ID of the popup.
	 * @param handler A function that returns the HTML content for the popup.
	 */
	registerPopup(id: string, handler: popupHandler) {
		this.popupHandlers.set(id, handler)
	}

	/**
	 * Opens a popup with the given content.
	 * @param content The HTML content to display inside the popup.
	 * @param closeOnOutsideClick Whether clicking outside the popup should close it.
	 */
	open(content: string, closeOnOutsideClick: boolean = true) {
		// Close any existing popup
		this.close()

		// Create the popup container
		this.popupElement = document.createElement("div")
		this.popupElement.id = "popup-container"
		this.popupElement.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
		this.popupElement.style.top = this.app.navbar.root.clientHeight + 1 + "px" // +1 for the nav border
		this.popupElement.style.height = window.innerHeight - this.app.navbar.root.clientHeight - 1 + "px"

		this.popupElement.innerHTML = content

		if (closeOnOutsideClick) {
			// Add click listener for closing the popup
			this.popupElement.addEventListener("click", (event) => {
				if (event.target === this.popupElement) {
					this.close()
				}
			})
			// Add escape key listener for closing the popup
			document.addEventListener("keydown", (event) => {
				if (event.key === "Escape" && this.isOpen()) {
					this.close()
				}
			})
			// Add a message above the popup
			const message = document.createElement("div")
			message.className = "absolute top-24 text-center text-white p-2"
			message.innerHTML = "Click outside to close the popup"
			this.popupElement.appendChild(message)
		}

		// Append the popup to the body
		console.log("Appending popup to body :", this.popupElement)
		document.body.appendChild(this.popupElement)
	}

	close() {
		if (this.popupElement) {
			this.popupElement.remove()
			this.popupElement = null
		}
	}

	isOpen(): boolean {
		return this.popupElement !== null
	}
}
