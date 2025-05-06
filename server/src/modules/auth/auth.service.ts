// src/modules/auth/auth.service.ts
import db from "../../core/db.js"
import User from "../../core/types.js"
import { comparePassword, hashPassword } from "../../utils/password_hash.js"

/**
 * Inscrit un nouvel utilisateur
 * @param username Nom d'utilisateur
 * @param password Mot de passe
 */
export async function registerUser(username: string, password: string): Promise<number> {
	const hashedPassword = await hashPassword(password)
	const stmt = db.prepare("INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)")
	const result = stmt.run(username, hashedPassword, 'default.png')
	return result.lastInsertRowid
}

export async function updateUserAvatar(userId: number, avatarFilename: string): Promise<void> {
	const stmt = db.prepare("UPDATE users SET avatar = ? WHERE id = ?")
	stmt.run(avatarFilename, userId)
}

/**
 * Valide les identifiants d'un utilisateur
 * @param username Nom d'utilisateur
 * @param password Mot de passe
 * @returns ID de l'utilisateur si valide, undefined sinon
 */
export async function validateUser(username: string, password: string): Promise<number | undefined> {
	const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as User | undefined
	
	if (!user || !(await comparePassword(password, user.password))) {
		return undefined
	}
	
	return user.id
}

export async function validateUserById(id: number, password: string): Promise<number | undefined> {
	const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined
	
	if (!user || !(await comparePassword(password, user.password))) {
		return undefined
	}
	
	return user.id
}

/**
 * Récupère les informations d'un utilisateur par son ID
 * @param userId ID de l'utilisateur
 * @returns Informations de l'utilisateur
 */
export function getUserById(userId: number): User {
	return db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as User
}

/**
 * Find or create user from Google profile
 */
export async function findOrCreateGoogleUser(googleId: string, email: string, name: string, picture?: string): Promise<number> {
	// Check if user exists with this Google ID
	const existingUser = db.prepare("SELECT * FROM users WHERE google_id = ?").get(googleId) as User | undefined;
	
	if (existingUser) {
		return existingUser.id;
	}
	
	// For Google users, use their Google ID as the username and no avatar
	const username = `user_${googleId}`;
	
	// Create new user with no avatar (null)
	const stmt = db.prepare("INSERT INTO users (username, google_id) VALUES (?, ?)");
	const result = stmt.run(username, googleId);
	
	return result.lastInsertRowid;
}