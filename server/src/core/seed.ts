import { registerUser } from "../modules/auth/auth.service.js"

export async function seedDatabase(db: any) {
	try {
		// Clear existing data (optional)
		db.exec(`
            DELETE FROM matches;
            DELETE FROM user_relationships;
            DELETE FROM users;
        `)

		// Create dummy users
		const users = ["Nabil", "David", "Coco", "Kiwi"]
		for (const username of users) {
			await registerUser(username, "password")
		}

		// Generate matches between every pair of users
		const matches: string[] = []
        for (let nsm = 0; nsm < 100; nsm++)
        {
            for (let i = 0; i < users.length; i++) {
                for (let j = i + 1; j < users.length; j++) {
                    const player1 = users[i]
                    const player2 = users[j]

                    // Randomly decide the winner and scores
                    const score1 = Math.floor(Math.random() * 4) // Random score between 1 and 10
                    const score2 = Math.floor(Math.random() * 4) // Random score between 1 and 10
                    const winner = score1 > score2 ? player1 : player2
                    const duration = Math.floor(Math.random() * 300) + 10 // Random duration between 10 and 300 seconds

                    matches.push(`('${player1}', '${player2}', '${winner}', ${score1}, ${score2}, ${duration})`)
                }
            }
        }

		// Insert all matches into the database
		db.exec(`
            INSERT INTO matches (player1, player2, winner, score1, score2, duration) VALUES
            ${matches.join(",\n")};
        `)

		console.log("Dummy data inserted successfully!")
	} catch (error) {
		console.error("Error seeding database:", error)
	}
}
