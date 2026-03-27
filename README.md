# Cricket Legends Hub  

A full-stack MERN (MongoDB, Express, React, Node.js) application for cricket enthusiasts to explore player statistics, match information, and team details. Built as a BTech final year project.

## Features

- **User Authentication** - JWT-based secure authentication with register, login, and profile management
- **Player Management** - Browse, search, and filter cricket players with detailed statistics
- **Match Information** - View upcoming and past matches with live scores and results
- **Team Details** - Explore national and franchise teams with rosters and stats
- **Responsive UI** - Modern, mobile-friendly interface built with React and Tailwind CSS
- **RESTful API** - Well-structured API with proper error handling and validation

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT Authentication (jsonwebtoken)
- bcryptjs for password hashing
- CORS, Helmet, Morgan middleware
- Rate limiting for API protection

### Frontend
- React 18 with Vite
- Tailwind CSS
- React Router DOM
- Axios for API calls
- React Context API for state management

## Project Structure

```
Cricket-Legends-Hub/
├── backend/
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── playerController.js
│   │   └── matchController.js
│   ├── middleware/
│   │   └── auth.js        # JWT verification
│   ├── models/
│   │   ├── User.js
│   │   ├── Player.js
│   │   ├── Match.js
│   │   └── Team.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── playerRoutes.js
│   │   └── matchRoutes.js
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cricket-legends
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/auth/profile | Get user profile | Yes |
| PUT | /api/auth/profile | Update user profile | Yes |

### Players
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/players | Get all players (filterable) | No |
| GET | /api/players/search | Search players | No |
| GET | /api/players/:id | Get player by ID | No |
| POST | /api/players | Create player | Admin |
| PUT | /api/players/:id | Update player | Admin |
| DELETE | /api/players/:id | Delete player | Admin |

### Matches
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/matches | Get all matches (filterable) | No |
| GET | /api/matches/:id | Get match by ID | No |
| POST | /api/matches | Create match | Admin |
| PUT | /api/matches/:id | Update match | Admin |
| DELETE | /api/matches/:id | Delete match | Admin |

## Database Models

### User
- name, email, password (hashed), role

### Player
- name, fullName, country, role, battingStyle, bowlingStyle
- stats (runs, wickets, matches, averages)
- currentTeam, dateOfBirth, playingFrom

### Match
- team1, team2, format, venue, date, status
- result (winner, margin), scores, manOfTheMatch

### Team
- name, shortName, country, type (National/Franchise)
- coach, captain, players, stats

## License

This project is licensed under the MIT License.

## Author

**Vivek Kumar Verma**
- GitHub: [@VivekGitNinja](https://github.com/VivekGitNinja)
- Email: vkumarverma670@gmail.com

## Acknowledgments

- Data sourced from public cricket statistics
- Built as a BTech final year project at NIET, Noida
- 
---
*Last updated: March 28, 2026*
