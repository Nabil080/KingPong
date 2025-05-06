function input(type: string, name: string, label: string, attributes: string = ""): string {
	return /* HTML */ `
		<div class="flex flex-col">
			<input
				type="${type}"
				id="${name}-input"
				name="${name}"
				${attributes}
				class="placeholder:text-grey-400 focus:ring-berry w-full border border-gray-300 px-4 py-1.5 focus:outline-none focus:ring-2"
				placeholder="${label}"
			/>
		</div>
	`
}

export function textInput(name: string, label: string, attributes: string = ""): string {
	return input("text", name, label, attributes)
}

export function passwordInput(name: string, label: string, attributes: string = ""): string {
	return input("password", name, label, attributes)
}

export function errorDiv(): string {
	return /* HTML */ ` <div class="text-red absolute -top-10 left-0 hidden w-full px-2 text-center text-sm" data-error>This is an error</div> `
}
