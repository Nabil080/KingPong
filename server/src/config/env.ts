import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Déterminer le répertoire actuel et le répertoire racine du projet
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')

// Charger les variables d'environnement du fichier .env
dotenv.config({ path: path.resolve(rootDir, '.env') })

/**
 * Variables d'environnement de l'application
 */

// Google Auth
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '41256366116-25b3t94fvqanbfqqthqlic42rpubi0lq.apps.googleusercontent.com'
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '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'
export const GOOGLE_CALLBACK_URI = process.env.GOOGLE_CALLBACK_URI || 'http://localhost:3000/auth/google/callback'

// Configuration du serveur
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const PORT = parseInt(process.env.PORT || '8080', 10)
export const HOST = process.env.HOST || '0.0.0.0'

// Configuration CORS
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://127.0.0.1:5501'

// Sécurité et sessions
export const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_change_in_production'

// Configuration de la base de données
export const DB_PATH = process.env.DB_PATH || 'database.sqlite'

// Upload de fichiers
export const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads'
export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10) // 5MB par défaut

// URLs
export const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:8080'
export const UPLOAD_URL_PREFIX = process.env.UPLOAD_URL_PREFIX || 'http://127.0.0.1:8080/uploads/'