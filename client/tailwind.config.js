module.exports = {
	content: ["./src/**/*.{html,js,ts,tsx}", "./public/index.html"],
	theme: {
		extend: {
			colors: {
				primary: "var(--primary)",
				secondary: "var(--secondary)",
				accent: "var(--accent)",
				background: "var(--background)",
			},
			filter: {
				"purple-primary":
					"brightness(0) saturate(100%) invert(24%) sepia(45%) saturate(5000%) hue-rotate(276deg) brightness(92%) contrast(105%)",
				"blue-primary":
					"brightness(0) saturate(100%) invert(20%) sepia(90%) saturate(2000%) hue-rotate(190deg) brightness(95%) contrast(105%)",
				"red-primary":
					"brightness(0) saturate(100%) invert(20%) sepia(80%) saturate(5000%) hue-rotate(345deg) brightness(95%) contrast(105%)",
			},
			fontFamily: {
				anonymous: ['"Anonymous Pro"', "monospace"],
				ancizar: ['"Ancizar Sans"', "sans-serif"],
			},
		},
	},
	plugins: [],
}
