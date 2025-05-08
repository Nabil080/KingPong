export function link(label: string, href: string = "#", pathname: string = href): string {
	return /* HTML */ `
		<a href="${href}" data-link="${pathname}" class="hover-effect mb-2 me-2 px-5 py-2.5 text-center text-lg font-medium"> ${label} </a>
	`
}

export function popupLink(id: string, label: string): string {
	return /* HTML */ ` <p data-popup="${id}" class="hover-effect text-center text-lg font-medium"> ${label} </a> `
}

export function baseButton(label: string, attributes: string = "type='button'"): string {
	return customButton(label, "bg-berry ", attributes)
}

export function customButton(label: string, classList: string, attributes: string = "type='button'"): string {
	return /* HTML */ `
		<button ${attributes} class="${classList} w-full px-5 py-1.5 text-center text-lg duration-200 hover:bg-opacity-80">${label}</button>
	`
}
