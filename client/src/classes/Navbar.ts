import { App } from "./App.js"
import { link } from "../components/buttons.js"
import { t } from "../translations/translations.js"
import { getAvatarPath } from "../utils/utils.js"

export default class Navbar {
	public root: HTMLElement = document.createElement("nav")

	constructor(private app: App) {
		// Create the navbar element
		this.root.className = "border-berry flex items-center justify-between border-b px-[25px]"
		this.root.style.height = "60px"
		this.root.innerHTML = /* HTML */ `
			<!-- Left section: Logo and flag -->
			<section id="left-nav" class="flex gap-4">
				<img id="logo" src="/assets/images/logo.png" href="/" data-link class="w-[38px]" alt="KingPong Logo" />
				<img
					data-popup="language"
					id="lang-flag"
					src="/assets/images/lang/${t("flag")}"
					class="h-[40px] cursor-pointer"
					alt="KingPong Flag"
				/>
			</section>

			<!-- Center section: Navigation buttons -->
			<section id="center-nav" class="flex items-center justify-center"></section>

			<!-- Right section: User info/login -->
			<section data-popup id="right-nav" class="hover-effect group flex items-center gap-2 [&>*]:pointer-events-none"></section>
		`
	}

	render() {
		// Insert the navbar at the start of the body
		document.body.insertBefore(this.root, document.body.firstChild)

		// Initial updates for dynamic content
		this.updateNavbarLanguageFlag()
		this.updateNavbarActiveLink()
		this.updateNavbarLoggedState()
	}

	updateNavbarActiveLink(pathname: string = this.app.router.currentPath) {
		const linksContainer = document.querySelector("nav #center-nav") as HTMLElement
		if (!linksContainer) return

		const activeLink = linksContainer.querySelector(`[data-link="${pathname}"]`)
		const previousActiveLink = linksContainer.querySelector(".active-link")
		console.log("Active link:", activeLink)
		console.log("Previous active link:", previousActiveLink)

		if (previousActiveLink) {
			previousActiveLink.classList.remove("active-link")
		}
		if (activeLink) {
			activeLink.classList.add("active-link")
		}
	}

	updateNavbarLanguageFlag() {
		const languageImage = document.querySelector("nav #lang-flag") as HTMLImageElement
		if (languageImage) {
			languageImage.src = `/assets/images/lang/${t("flag")}`
		}

		// Update links language
		const linksContainer = document.querySelector("nav #center-nav") as HTMLElement
		if (!linksContainer) return
		linksContainer.innerHTML = `
			${link(t("pong"), "/", "/?:pong")}
			${link(t("players"), "/players")}
			${link(t("tournament"), "/tournament")}
			${link(t("profil"), "/profil", "/profil/:?username")}
			${link(t("stats"), "/stats", "/stats/:?username")}
			${link(t("history"), "/history", "/history/:?username")}
			`
	}

	updateNavbarLoggedState() {
		const loggedUser = this.app.loggedUser
		const userInfoContainer = document.querySelector("nav #right-nav") as HTMLElement
		if (!userInfoContainer) return

		userInfoContainer.innerHTML = loggedUser
			? /* HTML */ `
					<span class="content-center justify-center">${loggedUser.username}</span>
					<img src="${getAvatarPath(loggedUser.avatar)}" alt="avatar" class="hover-effect avatar h-[38px] w-[38px]" />
				`
			: /* HTML */ ` <img src="/assets/images/icons/login.png" alt="avatar" class="hover-effect h-[38px] w-[38px]" /> `

		// Popup event
		userInfoContainer.setAttribute("data-popup", loggedUser ? "settings" : "connect")
	}
}
