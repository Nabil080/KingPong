import { connectPopup } from "../content/connect_popup.js"
import { t } from "../translations/translations.js"
import { RelationshipType, User } from "../types/user.js"
import { fileToBase64 } from "../utils/forms.js"
import { App } from "./App.js"
export default class Server {
	static URL: string
	isLoggedIn: boolean = false

	constructor(private app: App) {
		// Update the user if there is a session
		this.startSession()
	}

	async sendServerRequest(endpoint: string, method: string, body?: any): Promise<any> {
		try {
			const options: RequestInit = {
				method,
				credentials: "include", // Include cookies for authentication
			}

			// Only include the body if it is provided
			if (body) {
				options.body = JSON.stringify(body)
				options.headers = { "Content-type": "application/json" }
			}

			const res = await fetch(`${Server.URL}${endpoint}`, options)

			const data = await res.json()
			console.log("Server response:", data)

			if (!res.ok) {
				throw new Error(data.error || "Une erreur est survenue lors de la requête.")
			}

			return data
		} catch (error) {
			console.error("Server request error:", error)
			return { error: error instanceof Error ? error.message : "Une erreur inconnue est survenue." }
		}
	}

	async getSessionUser(): Promise<User | undefined> {
		try {
			const data = await this.sendServerRequest("/auth/me", "GET")

			if (data.loggedIn) {
				return data.user
			} else {
				return undefined
			}
		} catch (error) {
			console.error("Session check error:", error)
			return undefined
		}
	}

	async loginRequest(username: string, password: string): Promise<any> {
		try {
			const data = await this.sendServerRequest("/auth/login", "POST", { username, password })

			if (data.success) this.startSession()

			return data
		} catch (error) {
			console.error("Login error:", error)
			return { error: `${t("connectError")}` }
		}
	}

	async startSession(): Promise<any> {
		this.app.loggedUser = await this.getSessionUser()
		if (this.app.loggedUser) {
			// Connect to the websocket server
			await this.app.websocket.sendConnectMessage()
			this.isLoggedIn = true
			// Update the cache
			await this.app.cache.fetchAllUsers()
			// Update the view
			this.app.navbar.updateNavbarLoggedState()
			this.app.router.renderCurrentPage()
		} else {
			this.isLoggedIn = false
		}
	}

	public async logoutRequest(): Promise<any> {
		try {
			const data = await this.sendServerRequest("/auth/logout", "POST")

			if (data.success) this.stopSession()

			return data
		} catch (error) {
			console.error("Logout error:", error)
			return { error: `${t("logoutError")}` }
		}
	}

	async stopSession(): Promise<any> {
		if (this.isLoggedIn === false) return
		// Disconnect from the websocket server
		await this.app.websocket.sendLogoutMessage()
		this.isLoggedIn = false
		this.app.loggedUser = undefined
		// Update the cache
		await this.app.cache.fetchAllUsers()
		// Update the view
		this.app.navbar.updateNavbarLoggedState()
		this.app.router.renderCurrentPage()
	}

	async registerRequest(username: string, password: string, avatarFile?: File | null): Promise<any> {
		try {
			// Prepare the request body
			const requestBody: any = { username, password }

			// If there's an avatar file, convert it to base64 and add it to the request
			if (avatarFile) {
				// Read the file as base64
				const base64Avatar = await fileToBase64(avatarFile)

				// Add the avatar data and file type to the request
				requestBody.avatar = {
					data: base64Avatar,
					mimeType: avatarFile.type,
					filename: avatarFile.name,
				}
			}

			const data = await this.sendServerRequest("/auth/register", "POST", requestBody)

			if (data.success) {
				// Auto login after successful registration
				return this.loginRequest(username, password)
			}

			return data
		} catch (error) {
			console.error("Register error:", error)
			return { error: `${t("registError")}` }
		}
	}

	// ------------------ UPDATE REQUESTS ------------------
	async updateUsername(newUsername: string): Promise<any> {
		return this.sendServerRequest("/users/update/username", "POST", { username: newUsername })
	}

	async unblockUser(userId: number): Promise<any> {
		return this.sendServerRequest(`/users/unblock/${userId}`, "DELETE")
	}

	async modifyRelationshipRequest(targetId: number, relationship: RelationshipType) {
		if (this.isLoggedIn === false) {
			connectPopup(this.app)
			return
		}

		try {
			const data = await this.sendServerRequest("/users/update/relationship", "POST", {
				targetId,
				relationship,
			})

			if (data.success) {
				// update the cache
				this.app.cache.updateRelationship(targetId, relationship)
				// update the UI
				this.app.router.renderCurrentPage()
			}
		} catch (err) {
			console.error("Error updating relationship:", err)
		}
	}
}
