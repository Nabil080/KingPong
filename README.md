# KingPong 🏓

![20250518-0021-49 1255133-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/5350d800-ac6e-4c02-985f-8f0c565896ca)

A full-stack multiplayer Pong game built as a Single Page Application (SPA) for seamless, real-time gameplay, tournaments, and social features. KingPong delivers a fluid experience with live user status updates, customizable themes, and efficient caching—demonstrating my skills in modern web development and real-time systems.

> **Note**: Check out the [screenshots](#-screenshots) below or this [demo video](https://youtu.be/FOPV-0sY1fc) for a closer look. Also feel free to check the code or compile on your machine.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Development](#-development)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [WebSocket Events](#-websocket-events)
- [Game Controls](#-game-controls)
- [Language Support](#-language-support)
- [Testing](#-testing)
- [Privacy](#-privacy)
- [Screenshots](#-screenshots)

## 🎮 Overview

KingPong is a web-based Pong game where players compete in real-time matches, join tournaments, and connect through chat and friends. As an SPA, it offers smooth navigation without page refreshes, with ongoing games visible in the background. Live status updates (online, offline, or playing) and smart caching keep the experience fast and engaging. This project highlights my ability to build scalable, user-focused apps with real-time features.

## ✨ Features

### Game Modes
- **Local Multiplayer**: Play head-to-head on one device.
- **Online Multiplayer**: Real-time matches with seamless reconnection if disconnected.
- **Bot Players**: Practice against AI (Easy, Medium, Hard, Extreme).
- **Tournament Mode**: 4-player bracket tournaments with live updates.

### Customization
- **Custom Themes**: Change the app’s color scheme for a personalized experience.
- **Game Physics**: Adjust ball speed, paddle size, and more.
- **Language Support**: English, French, Chinese, Tamil, Arabic.
- **User Profiles**: Update username, avatar, or password anytime.

### Social Features
- **Real-Time Chat**: Instant messaging with unread message pings on user profiles.
- **Real-Time Spectating**: Spectate other player's game.
- **Friend Management**: Add friends, block users, and see live status (online, offline, playing).
- **Notifications**: Fading or persistent alerts for invites, messages, etc., with click-to-redirect or discard options.
- **Player Stats**: View match history and performance metrics.
- **Caching**: Client-side cache minimizes API calls for faster performance.

### Authentication
- **Username/Password**: Secure login with easy updates.
- **Google OAuth**: Quick sign-in integration.
- **JWT**: Token-based session management.

### Security
- **Cross-Site Scripting (XSS)**: All stored user inputs are sanitized to prevent malicious script injection. HTML elements are created programmatically to ensure safe rendering.
- **SQL Injection**: Database queries use prepared statements with parameterized inputs to eliminate the risk of SQL injection attacks.
- **Request Validation**: Every API request is validated against strict JSON schemas to ensure data integrity and prevent malformed or malicious inputs.
- **JSON Web Tokens (JWT)**: Authentication is handled via JWTs, with short-lived access tokens and secure refresh tokens stored in HttpOnly cookies to prevent client-side access. Tokens are validated server-side to ensure session integrity.
- **Server-Side Game Logic**: All critical game calculations are performed server-side using an authoritative server model, preventing clients from manipulating game state or cheating.
- **Secure WebSocket Communication**: Real-time features like gameplay and chat use WebSocket Secure (WSS) over TLS to encrypt data in transit. WebSocket connections require authenticated tokens to prevent unauthorized access.
- **HTTPS Encryption**: All network communication, including API calls and WebSocket connections, is secured with TLS to protect sensitive data like user credentials and game states.
- **Password Security**: User passwords are hashed using bcrypt.
- **CSRF Protection**: Cross-Site Request Forgery is mitigated through anti-CSRF tokens and strict origin checks for all state-changing requests.

## 🛠 Tech Stack

### Frontend
- **TypeScript**: Type-safe code.
- **Tailwind CSS**: Utility-first styling with theme support.
- **Chart.js**: Visualizing player stats.
- **WebSocket**: Real-time gameplay and status updates.

### Backend
- **Node.js**: Efficient runtime.
- **Fastify**: Fast API and WebSocket framework.
- **SQLite**: Lightweight database (better-sqlite3).
- **JWT**: Secure authentication.

### DevOps
- **Docker**: Containerized setup.
- **Docker Compose**: Multi-container management.
- **HTTPS**: Self-signed SSL for development.

## 📦 Prerequisites

- Docker and Docker Compose.
- Node.js 22+ (for non-Docker setup).

## 🚀 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Nabil080/KingPong
   cd KingPong
   ```

2. **Set Up Environment Variables**
   In `server/.env`:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URI=http://localhost:3000/auth/google/callback
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Run with Docker**
   ```bash
   make dev
   ```
   Or:
   ```bash
   docker compose up --build
   ```

4. **Access**
   - Frontend: http://localhost:3000
   - API: http://localhost:8080
   - WebSocket: ws://localhost:8080/ws

## 💻 Development

### Make Commands
```bash
make dev     # Start dev environment
make build   # Build images
make up      # Run containers
make down    # Stop containers
make clean   # Reset database
make fclean  # Full cleanup
make re      # Rebuild all
```

### Manual Setup
**Frontend:**
```bash
cd client
npm install
npm run dev
```

**Backend:**
```bash
cd server
npm install
npm run dev
```

## 🏗 Architecture

KingPong’s SPA design ensures fluid navigation, with WebSockets powering live updates for gameplay, user status (online/offline/playing), and notifications. A client-side cache optimizes performance by reducing redundant requests.

### Project Structure
```
KingPong/
├── client/                # SPA frontend
│   ├── src/
│   │   ├── classes/      # App, Router, Game Engine
│   │   ├── components/   # UI (notifications, themes)
│   │   ├── content/      # Pages/views
│   │   ├── types/        # TypeScript types
│   │   ├── translations/ # Language files
│   │   └── utils/        # Cache, WebSocketClient
│   └── public/           # Assets
├── server/               # Backend
│   ├── src/
│   │   ├── modules/      # Auth, users, game, etc.
│   │   ├── config/       # Database, env
│   │   └── utils/        # Helpers
│   └── public/           # Avatars
└── docker-compose.yml    # Docker config
```

## 📡 API Documentation

### Authentication Endpoints
```http
POST   /auth/register      # Create new account
POST   /auth/login         # Login with credentials
POST   /auth/google/token  # Google OAuth login
GET    /auth/me           # Get current user
POST   /auth/logout       # Logout user
```

### User Management
```http
GET    /users/all         # Get all users
GET    /users/list        # Get users with relationships
GET    /users/:id         # Get specific user
POST   /users/update/username     # Update username
POST   /users/update/avatar       # Update avatar
POST   /users/update/password     # Update password
POST   /users/update/relationship # Manage friends/blocks
DELETE /users/delete/:id          # Delete account
```

### Game Management
```http
GET    /game/state        # Get current game state
POST   /game/invite       # Send game invitation
POST   /game/join         # Accept invitation
POST   /game/decline      # Decline invitation
POST   /game/ready        # Toggle ready state
POST   /game/keyEvent     # Send keyboard input
POST   /game/moveEvent    # Send movement
```

### Match History
```http
GET    /matches/all       # Get all matches
GET    /matches/:username # Get user's matches
POST   /matches/create    # Record new match
```

## 🔌 WebSocket Events

### Client to Server
```javascript
connect       # Authenticate WebSocket connection
ping          # Keep-alive ping
logout        # Disconnect user
chat          # Send chat message
invite        # Send game invitation
invite-response # Accept/decline invitation
ready         # Toggle ready state
key-event     # Send keyboard input
cancel-invite # Cancel pending invitation
cancel-game   # Leave active game
```

### Server to Client
```javascript
connect       # User connected notification
logout        # User disconnected notification
chat          # Incoming chat message
invite        # Game invitation received
invite-response # Invitation response
gameState     # Game state update
cancel-invite # Invitation cancelled
cancel-game   # Game cancelled
```

## 🎮 Game Controls

- **Player 1 (Left)**: W (up), S (down)
- **Player 2 (Right)**: ↑ (up), ↓ (down)

## 🌐 Language Support

Switch via flag icon: English 🇬🇧, French 🇫🇷, Chinese 🇨🇳, Tamil 🇱🇰, Arabic 🇲🇦.

## 🧪 Testing

Use `GET /dummy` to populate test users and matches (auto-runs on setup).

## 🔒 Privacy

KingPong is GDPR compliant, prioritizing user control with clear data policies, secure authentication, and options to update or delete accounts.

## 📸 Screenshots

<div style="text-align: center;">
  <p>Screenshots showcasing some features of KingPong. See the <a target="_blank" href="https://youtu.be/FOPV-0sY1fc">demo video</a> for dynamic gameplay and interactions.</p>
</div>

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/046bf78c-b9e4-417c-a2ac-a6fc799de2a0" alt="Homepage" width="600">
  <p><em>Homepage with live game in the background</em></p>
</div>

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/c44bb66c-bf3c-4835-bb4a-7f97269f1d67" alt="Player List" width="600">
  <p><em>Player list showing live status (online, offline, playing)</em></p>
</div>

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/b7a7a492-db86-4807-bc4f-3837587a7481" alt="Profile Page" width="600">
  <p><em>User profile with stats and unread message pings</em></p>
</div>

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/69eea6f7-302a-420c-b47c-ab2bc025b1fd" alt="Online Game" width="600">
  <p><em>Online game waiting for player, with custom theme</em></p>
</div>

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/23f633e6-4503-4543-a94a-0fd5d9387ac0" alt="User Settings" width="600">
  <p><em>User settings with custom theme</em></p>
</div>

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/04412a70-9db3-4772-ba7a-8432c6aabfc1" alt="Player Statistics" width="600">
  <p><em>Player statistics with language switched</em></p>
</div>
