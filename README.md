# Real-time Notification System

## 📝 Description
A real-time notification system built with Node.js, Express, and Socket.IO that enables instant notification delivery to specific users. The system supports persistent storage of notifications and real-time updates through WebSocket connections.

## ✨ Features
- 🚀 Real-time notifications using WebSocket
- 💾 In-memory notification storage
- 🎯 User-specific notification targeting
- 📱 REST API endpoints for notification management
- ⚡ Instant delivery of notifications
- 🔄 Latest 20 notifications retrieval
- ⏱️ Timestamp tracking for notifications

## 🛠️ Technical Stack
- Node.js
- Express.js
- Socket.IO
- CORS support
- dotenv for environment configuration

## 💻 Installation

\`\`\`bash
# Clone the repository
git clone [[your-repository-url](https://github.com/harshsingh5023/insyd-notification-poc)]

# Navigate to the project directory
cd backend

# Install dependencies
npm install

# ⚙️ Environment Variables for backend
CORS_ORIGIN=some-url

# Create .env file and configure environment variables
cp .env.example .env

### Starting the Server
node index.js

# Navigate to the frontend part
cd frontend

# Install dependencies
npm install

# ⚙️ Environment Variables for frontend

NEXT_PUBLIC_API_BASE_URL=some-url
NEXT_PUBLIC_WEBSOCKET_URL=somw-url


### Starting the frontend

npm run dev


\`\`\`


