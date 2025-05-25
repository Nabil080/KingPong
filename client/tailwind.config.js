module.exports = {
	content: ["./src/**/*.{html,js,ts,tsx}", "./public/index.html"],
	theme: {
		extend: {
			colors: {
				primary: "#500A59",
				secondary: "#940AA1",
				accent: "#C10BD9",
				background: "#230926",
			},
			fontFamily: {
				anonymous: ['"Anonymous Pro"', "monospace"],
				ancizar: ['"Ancizar Sans"', "sans-serif"],
			},
		},
	},
	plugins: [],
}
