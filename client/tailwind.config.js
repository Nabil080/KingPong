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
			fontFamily: {
				anonymous: ['"Anonymous Pro"', "monospace"],
				ancizar: ['"Ancizar Sans"', "sans-serif"],
			},
		},
	},
	plugins: [],
}
