# 🚀 CareerMap India – Smart Career Decision Platform for Engineers

CareerMap India is a structured career intelligence platform for Indian engineering students. It helps B.Tech graduates make informed decisions about private jobs, higher studies, government exams, and entrepreneurship.

## ✨ Features

- **Career Categories**: Private Jobs, Higher Studies, Government Jobs, Entrepreneurship.
- **Branch-Specific Insights**: Detailed pages for CSE, ECE, Mechanical, Civil, EEE.
- **Career Detail Pages**: Salary trends, demand levels, skill requirements, roadmaps.
- **Personalized Career Quiz**: Recommends top career paths based on user preferences.
- **Career Comparison Engine**: Compare multiple career options side-by-side.
- **12-Month Roadmap**: Structured preparation plans for each career path.

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **AI**: Gemini API Integration

## 📂 Project Structure

- `backend/`: Node.js API and database models.
- `public/`: Frontend HTML/CSS/JS files.
- `proddoc.txt`: Complete product documentation.

## 🏁 Getting Started

### Prerequisites

- Node.js (14+)
- MongoDB Atlas Account
- Gemini API Key (free)

### Setup

1. **Clone the repository**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

2. **Update .env**
Add your database and API keys:
```env
DATABASE_URL=your_mongodb_connection_string
GEMINI_KEY_1=your_gemini_api_key
```

3. **Run the server**
```bash
npm start
# The server will start at http://localhost:5000
```

4. **Open the app**
Open `http://localhost:5000` in your browser.

## 🎯 Development Roadmap

- **Phase 1 (Current)**: Core structure, quiz, career pages, comparison engine.
- **Phase 2**: Data expansion, salary dashboard, exam planner.
- **Phase 3**: AI chat advisor, resume builder, mobile app.

## 📄 License

MIT