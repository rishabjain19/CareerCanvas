# CareerCanvas
 <table>
  <tr>
    <td><img width="100%" alt="CareerCanvas Login" src="https://github.com/user-attachments/assets/57787b02-29cc-481a-9465-b404bf804776" /></td>
    <td><img width="100%" alt="CareerCanvas Job Board" src="https://github.com/user-attachments/assets/da91fd1e-bf8c-4015-8dca-f88777a11037" /></td>
  </tr>
</table>



A full-stack internship application tracker built with the MERN stack. Replaces the typical messy spreadsheet with a visual Kanban board, AI-powered resume feedback, and one-click Google Calendar scheduling for interviews.

## Demo

Live app: [CareerCanvas on Vercel](https://career-canvas-six.vercel.app)

Backend API: [CareerCanvas API on Render](https://careercanvas-h3qy.onrender.com)

**Note:** Your credentials are completely secure. Passwords are hashed using the `bcryptjs` library before being stored in the database, and are never visible to the developer.

## Features

**User Authentication**
- Secure sign-up and login using JWT (JSON Web Tokens)
- Passwords hashed with bcrypt (10 salt rounds) before storage
- Token-based session persistence for 7 days
- Protected routes on both frontend and backend

**Kanban Job Board**
- Drag-and-drop application tracking across five stages: To Apply, Applied, Interview, Offer, Rejected
- Built with `@dnd-kit` for accessible, modern drag interactions
- Optimistic UI updates — status changes feel instant, with automatic rollback if the server request fails
- Each card stores company, role, salary, location, application link, and notes

**AI Resume Feedback**
- Upload a resume (image or PDF) directly inside the job application form
- Paste the job description alongside it
- Powered by Google's Gemini API (multimodal — reads the resume file natively, no OCR step needed)
- Returns a match percentage, missing skills, and specific actionable suggestions

**Google Calendar Integration**
- One-click "Add to Google Calendar" link for any application marked as Interview
- No OAuth, no API key required — generates a pre-filled Google Calendar event link client-side
- Automatically includes company, role, date/time, location, and notes

**Student Profile**
- Optional profile section — college, year, GPA, interests, LinkedIn, GitHub, LeetCode links
- Skippable on signup, editable any time from the navbar

**Stats Overview**
- Live counts (total, applied, interviews, offers) derived directly from job data, no separate API call needed

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router v6
- Context API (auth/job state management)
- Axios with request interceptors
- @dnd-kit (drag and drop)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Bcrypt for password hashing
- Google Gemini API (resume feedback)
- CORS configuration

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/rishabjain19/careercanvas.git
cd careercanvas
```

### 2. Setup the backend
```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend in dev mode:
```bash
npm run dev
```

### 3. Setup the frontend
```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:
```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Now open `http://localhost:5173` in your browser.

## Deployment

### Backend (Render)
1. Create a new **Web Service** on Render
2. Connect your GitHub repo → set **Root Directory** to `backend`
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `PORT`
4. Build Command:
   ```
   npm install
   ```
5. Start Command:
   ```
   npm start
   ```

### Frontend (Vercel)
1. Import your GitHub repo into Vercel
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   ```
   VITE_API_URL=https://careercanvas-h3qy.onrender.com/api
   ```
4. Build Command: `npm run build` (auto-detected)
5. Output Directory: `dist` (auto-detected for Vite)

## Project Structure

```
careercanvas/
│
├── backend/
│   ├── config/         # MongoDB connection setup
│   ├── controllers/    # Auth, job, and AI controllers
│   ├── middleware/      # JWT verification middleware
│   ├── models/         # Mongoose schemas (User, Job)
│   ├── routes/         # Express route definitions
│   └── server.js        # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios instance with auth interceptor
│   │   ├── components/   # JobCard, Column, KanbanBoard, JobModal, etc.
│   │   ├── context/       # AuthContext, JobContext
│   │   ├── pages/         # Login, Register, Board, Profile
│   │   ├── utils/          # Google Calendar link generator
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## API Endpoints

**Auth** (public unless noted)
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile     (protected)
PUT    /api/auth/profile     (protected)
```

**Jobs** (all protected)
```
GET    /api/jobs
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
```

**AI** (protected)
```
POST   /api/ai/resume-feedback
```

## Key Learnings

- Implementing stateless JWT authentication from scratch, including ownership-based authorization on top of it
- Building accessible drag-and-drop interactions with `@dnd-kit`
- Optimistic UI updates with rollback on failure
- Integrating a multimodal AI API (Gemini) to read files directly without a separate OCR pipeline
- Generating calendar links without OAuth overhead
- Structuring a MERN app for clean separation between two independently deployable services

## Future Improvements

- Add OAuth-based full Google Calendar sync (auto-create/update events instead of one-click links)
- Email reminders for upcoming interviews
- Resume version history
- Analytics on application-to-offer conversion rates
- Dark mode

## Author/Developer

Rishabh Jain

GitHub: [@rishabjain19](https://github.com/rishabjain19)
