# StackIQ 🚀
### AI-Based Interview Preparation System

StackIQ is a full-stack web application that helps developers prepare for technical interviews using AI-generated questions, real-time evaluation, and adaptive difficulty assessment.

---

## 📸 Overview

StackIQ provides a premium, glassmorphic dark-mode UI where users can:
- Register/Login securely with JWT authentication
- Take AI-generated coding & technical interview tests
- Get instant AI-powered evaluation and feedback on their answers
- Track their performance history on a personalized dashboard

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI Framework |
| Redux Toolkit | State Management |
| Tailwind CSS | Styling |
| Axios | HTTP Client |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API Server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Groq AI (LLaMA) | AI Question Generation & Evaluation |

---

## 📁 Project Structure

```
STACKIQ/
├── Frontend/
│   └── client/          # React + Vite frontend app
│       ├── src/
│       │   ├── Pages/   # Login, Register, Dashboard, Test, Results
│       │   ├── Redux/   # Store, Slices (auth, dashboard)
│       │   ├── api/     # Axios instance
│       │   └── components/  # Navbar, shared components
│       └── ...
│
└── Backend/
    └── PrepConnection/  # Express REST API
        ├── controllers/ # Auth, Dashboard, AI logic
        ├── models/      # Mongoose schemas
        ├── Routes/      # API route definitions
        └── server.js
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Groq API Key

### Backend Setup
```bash
cd Backend/PrepConnection
npm install
# Create .env with: MONGO_URI, JWT_SECRET, GROQ_API_KEY, PORT
npm start
```

### Frontend Setup
```bash
cd Frontend/client
npm install
# Create .env with: VITE_API_URL=http://localhost:5000
npm run dev
```

---

## ✨ Features

- 🔐 **Secure Auth** — JWT-based login/register with protected routes
- 🤖 **AI Questions** — Groq LLaMA generates topic-specific interview questions
- 📊 **Smart Evaluation** — AI evaluates code/answers with detailed feedback
- 📈 **Dashboard** — Track attempts, scores, and performance over time
- 🎨 **Premium UI** — Dark glassmorphism design with smooth animations

---

## 👤 Author

**Panjamohan** — [GitHub](https://github.com/Panjamohan1819)
