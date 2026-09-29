# 🚀 SkillGap — Student Employability Intelligence Platform

> *"Know your skills. Find your gaps. Build your future."*

SkillGap is an AI-powered Student Employability Intelligence Platform that helps college students, placement cells, and recruiters understand the exact gap between students' current skills and industry requirements for internships and engineering roles.

---

## 🌟 Key Highlights & Differentiators

- **Explainable Profile Readiness**: Transparently calculated composite indicator:
  $$\text{Readiness} = (35\% \times \text{Skill Coverage}) + (25\% \times \text{Evidence Coverage}) + (20\% \times \text{Projects}) + (10\% \times \text{Resume ATS}) + (10\% \times \text{Assessments})$$
- **Multi-Stream Skill Evidence System**: Distinguishes self-claims from verifiable evidence (tested projects, public GitHub code, technical assessments, and resume mentions).
- **Interactive Technical Assessments**: Practical MCQ, debugging, and scenario-based tests with instant scoring and automatic evidence recording.
- **Job Description Analyzer**: Paste any raw job description from LinkedIn/Handshake to extract requirements and test real-time profile match.
- **Milestone Learning Roadmap**: Structured phase-by-phase pathway with learning objectives, documentation, practice tasks, and project challenges.
- **Grounded AI Career Advisor**: Chat assistant strictly referencing the student's real profile, skill gaps, and projects (no hallucinated companies or fabricated claims).
- **Kanban Application Tracker**: Manage applications across *Saved, Applied, Assessment, Interview, Offer, Rejected, Withdrawn*.
- **Placement Cell Dashboard**: Aggregated employability analytics across departments and cohort-wide skill gap patterns.

---

## 🏗️ Architecture & Tech Stack

```
SkillGap/
├── backend/                  # FastAPI 0.110+ Backend
│   ├── app/
│   │   ├── api/             # Auth, Profile, Skills, Projects, Resume, Skill Gap, Roadmap, Assessments, Opportunities, Kanban, AI, Placement
│   │   ├── database/        # SQLAlchemy session & seed script
│   │   ├── models/          # PostgreSQL / SQLite declarative models
│   │   ├── schemas/         # Pydantic validation schemas
│   │   ├── services/        # AIService, ResumeService, SkillGapService, GitHubService, RecommendationService
│   │   └── utils/           # JWT & bcrypt security
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                 # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/      # ReadinessGauge, Radar Chart, CategoryBars, SkillGapCards, Kanban, AI Drawer, Modals
│   │   ├── context/         # AuthContext
│   │   ├── layouts/         # DashboardLayout
│   │   ├── pages/           # Landing, Login, Register, Onboarding, Dashboard, Profile, SkillGap, Roadmap, Assessments, Opportunities, Kanban, Evidence, Placement
│   │   └── services/        # Axios API clients
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS with custom Glassmorphism and dark SaaS palette
- **Charts**: Recharts (Radar charts, horizontal progress bars, aggregate histograms)
- **Icons**: Lucide React
- **Routing**: React Router v6

### Backend
- **Framework**: FastAPI (Python 3.12)
- **ORM & DB**: SQLAlchemy with PostgreSQL & SQLite support
- **Authentication**: JWT Bearer tokens with bcrypt password hashing
- **File Parsing**: `pypdf` & `python-docx` for resume ATS parsing
- **AI Layer**: Dual-mode engine supporting Gemini / OpenAI APIs with a deterministic rule-based semantic fallback.

---

## ⚡ Quick Start (Local Development)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app/database/seed.py
uvicorn app.main:app --reload --port 8001
```

The backend will start at `http://localhost:8001` (OpenAPI Swagger docs at `http://localhost:8001/docs`).

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5174`.

---

## 🐳 Docker Deployment

To launch the full production stack (PostgreSQL + FastAPI + Nginx React Frontend):

```bash
docker-compose up --build -d
```

- **Web Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs`

---

## 🔑 Pre-seeded Demo Accounts

| Role | Email | Password | Details |
|---|---|---|---|
| **Student (Alex Sharma)** | `alex.sharma@skillgap.dev` | `password123` | B.Tech CS student with 3 projects, roadmap, assessments, and skill gaps |
| **Placement Officer** | `placement@abctech.edu` | `password123` | Placement cell aggregated university analytics |
| **Administrator** | `admin@skillgap.dev` | `admin123` | Platform & taxonomy management |

---

## 🔒 Security & Privacy

1. Sensitive resume files are stored in private isolated directories per user and never exposed publicly.
2. Direct bcrypt cryptographic hashing for passwords.
3. JWT tokens with configurable expiration and secure HTTP headers.
4. Input validation on all endpoints using Pydantic schemas.

---

## 📄 License
MIT License © 2026 SkillGap Platform.
