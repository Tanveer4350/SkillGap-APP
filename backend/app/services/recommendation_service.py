import json
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.roadmap import Roadmap, RoadmapItem
from app.models.target_role import TargetRole
from app.models.skill_gap import SkillGapAnalysis

class RecommendationService:
    @staticmethod
    def generate_personalized_roadmap(db: Session, user_id: int, target_role_id: int) -> Roadmap:
        role = db.query(TargetRole).filter(TargetRole.id == target_role_id).first()
        role_name = role.title if role else "Full Stack Developer"

        # Check existing roadmap
        existing_roadmap = db.query(Roadmap).filter(
            Roadmap.user_id == user_id,
            Roadmap.target_role_id == target_role_id
        ).first()

        if existing_roadmap:
            return existing_roadmap

        # Pre-built comprehensive roadmaps for various careers
        roadmap_templates = {
            "Full Stack Developer": [
                {
                    "phase": 1,
                    "title": "Modern JavaScript & TypeScript Fundamentals",
                    "skill": "JavaScript",
                    "category": "Frontend / Programming",
                    "why": "Deep mastery of asynchronous JS, event loops, DOM manipulation, and TypeScript typing is essential for full stack fluency.",
                    "prerequisites": ["HTML & CSS Basics"],
                    "objectives": [
                        "Master closures, lexical scope, and `this` binding",
                        "Work with Promises, async/await, and fetch APIs",
                        "Build strict TypeScript interfaces, generics, and types"
                    ],
                    "resources": [
                        {"title": "JavaScript.info - The Modern Tutorial", "type": "doc", "url": "https://javascript.info", "duration": "3 hours"},
                        {"title": "TypeScript Official Handbook", "type": "doc", "url": "https://www.typescriptlang.org/docs/", "duration": "2 hours"}
                    ],
                    "task": {
                        "title": "Build a Typed Event Bus",
                        "description": "Implement a type-safe PubSub event emitter in TypeScript with subscription tokens and error handling.",
                        "test_criteria": "Support .subscribe(), .publish(), and unsubscribing cleanly with typed payload checks."
                    },
                    "project": {
                        "title": "Interactive Task & Kanban Manager in TypeScript",
                        "description": "Build an offline-first task board utilizing LocalStorage and TypeScript models.",
                        "skills": ["JavaScript", "TypeScript", "HTML5"],
                        "estimated_hours": 8
                    },
                    "assessment": "JavaScript"
                },
                {
                    "phase": 2,
                    "title": "Component-Driven Frontend with React",
                    "skill": "React",
                    "category": "Frontend",
                    "why": "React enables component-based scalable web interfaces with declarative state and fast virtual DOM diffing.",
                    "prerequisites": ["JavaScript ES6+", "DOM"],
                    "objectives": [
                        "Master useState, useEffect, useMemo, and custom hooks",
                        "Implement client-side routing with React Router",
                        "Manage global state efficiently and build accessible UI components"
                    ],
                    "resources": [
                        {"title": "React.dev - Official Interactive Docs", "type": "interactive", "url": "https://react.dev", "duration": "4 hours"},
                        {"title": "Tailwind CSS Component Patterns", "type": "doc", "url": "https://tailwindcss.com/docs", "duration": "1 hour"}
                    ],
                    "task": {
                        "title": "Build a Debounced Search Hook",
                        "description": "Write a `useDebounce` hook and an autocomplete component with keyboard navigation.",
                        "test_criteria": "Handle rapid keystrokes cleanly without excessive re-renders."
                    },
                    "project": {
                        "title": "Full-Featured Analytics & Metrics Dashboard",
                        "description": "A responsive dashboard with charts (Recharts), dark mode, filtering, and mock API data.",
                        "skills": ["React", "Tailwind CSS", "Recharts"],
                        "estimated_hours": 12
                    },
                    "assessment": "React"
                },
                {
                    "phase": 3,
                    "title": "Robust Backend APIs with Node.js / FastAPI",
                    "skill": "FastAPI",
                    "category": "Backend",
                    "why": "Fast, well-documented backend microservices handle business logic, data validation, and authentication securely.",
                    "prerequisites": ["Python / JavaScript", "HTTP Protocol"],
                    "objectives": [
                        "Design RESTful API routes with clean request/response validation",
                        "Implement JWT authentication, hashing, and role-based access control",
                        "Structure modular controller-service-repository architecture"
                    ],
                    "resources": [
                        {"title": "FastAPI Tutorial - User Guide", "type": "doc", "url": "https://fastapi.tiangolo.com/tutorial/", "duration": "3 hours"},
                        {"title": "REST API Best Practices & Security Guidelines", "type": "doc", "url": "https://restfulapi.net/", "duration": "1.5 hours"}
                    ],
                    "task": {
                        "title": "Secure Auth Middleware",
                        "description": "Create a Bearer token verification dependency with refresh token rotation.",
                        "test_criteria": "Reject invalid/expired tokens with standard 401 HTTP codes."
                    },
                    "project": {
                        "title": "Scalable RESTful Booking & Reservation API",
                        "description": "Multi-tenant API with JWT auth, rate limiting, and automated Swagger/OpenAPI docs.",
                        "skills": ["FastAPI", "Python", "JWT", "Pydantic"],
                        "estimated_hours": 14
                    },
                    "assessment": "FastAPI"
                },
                {
                    "phase": 4,
                    "title": "Relational Databases & Indexing with PostgreSQL",
                    "skill": "PostgreSQL",
                    "category": "Database",
                    "why": "PostgreSQL provides ACID transactions, robust relation constraints, high concurrency, and advanced indexing for production reliability.",
                    "prerequisites": ["Basic SQL queries"],
                    "objectives": [
                        "Design normalized entity-relationship schemas (1:N, N:M)",
                        "Write complex JOINs, aggregate queries, and window functions",
                        "Optimize slow queries with B-Tree indexes and EXPLAIN ANALYZE"
                    ],
                    "resources": [
                        {"title": "PostgreSQL Tutorial for Developers", "type": "doc", "url": "https://www.postgresqltutorial.com/", "duration": "4 hours"},
                        {"title": "Database Indexing Explained Visually", "type": "interactive", "url": "https://use-the-index-luke.com/", "duration": "2 hours"}
                    ],
                    "task": {
                        "title": "Optimize an N+1 Query",
                        "description": "Refactor a nested loop database query using JOINs and ORM joinedload to reduce execution time by 80%.",
                        "test_criteria": "Execute in a single database query."
                    },
                    "project": {
                        "title": "E-Commerce Database Schema & Query Optimization Engine",
                        "description": "Complete database design for orders, inventory, customers, with transaction isolation levels.",
                        "skills": ["PostgreSQL", "SQLAlchemy", "Database Design"],
                        "estimated_hours": 10
                    },
                    "assessment": "PostgreSQL"
                },
                {
                    "phase": 5,
                    "title": "Containerization & Orchestration with Docker",
                    "skill": "Docker",
                    "category": "DevOps",
                    "why": "Docker encapsulates code, dependencies, and environment configurations into portable, immutable containers.",
                    "prerequisites": ["Linux CLI basics", "Application packaging"],
                    "objectives": [
                        "Write production-grade multi-stage Dockerfiles with minimal image size",
                        "Orchestrate multi-container environments (Frontend + Backend + DB + Redis) with Docker Compose",
                        "Configure volume persistence, networks, and environment variables securely"
                    ],
                    "resources": [
                        {"title": "Docker Official Getting Started Guide", "type": "interactive", "url": "https://docs.docker.com/get-started/", "duration": "3 hours"},
                        {"title": "Docker Compose Multi-Container Workflow", "type": "doc", "url": "https://docs.docker.com/compose/", "duration": "2 hours"}
                    ],
                    "task": {
                        "title": "Multi-Stage Dockerfile for Full-Stack App",
                        "description": "Write a multi-stage Dockerfile that builds a React frontend and serves static assets via Nginx in under 30MB.",
                        "test_criteria": "Produce a small image using alpine base with zero build dependencies left in the final image."
                    },
                    "project": {
                        "title": "Full-Stack Microservices Architecture with Docker Compose",
                        "description": "Orchestrate a complete platform with frontend, backend, PostgreSQL database, and Redis cache with one command.",
                        "skills": ["Docker", "Docker Compose", "Nginx", "Linux"],
                        "estimated_hours": 10
                    },
                    "assessment": "Docker"
                },
                {
                    "phase": 6,
                    "title": "Cloud Deployment & CI/CD Automation",
                    "skill": "AWS",
                    "category": "Cloud & CI/CD",
                    "why": "Deploying scalable web applications with automated testing and continuous deployment completes the professional engineering lifecycle.",
                    "prerequisites": ["Docker", "Git"],
                    "objectives": [
                        "Deploy containerized workloads to cloud platforms (AWS ECS / App Runner / Vercel)",
                        "Configure GitHub Actions to automatically run linter, tests, and build artifacts on PRs",
                        "Set up SSL/HTTPS, domain routing, and health check monitoring"
                    ],
                    "resources": [
                        {"title": "AWS Cloud Practitioner / ECS Guide", "type": "doc", "url": "https://aws.amazon.com/getting-started/", "duration": "3 hours"},
                        {"title": "GitHub Actions CI/CD Pipeline Tutorial", "type": "interactive", "url": "https://docs.github.com/en/actions", "duration": "2 hours"}
                    ],
                    "task": {
                        "title": "Automated GitHub Actions CI Pipeline",
                        "description": "Create a `.github/workflows/ci.yml` file that triggers on push, installs dependencies, and runs tests.",
                        "test_criteria": "Pass all unit tests and verify automated artifact build output."
                    },
                    "project": {
                        "title": "Production Deployment of Full-Stack Application",
                        "description": "Deploy your live application with custom domain, HTTPS, automated CI/CD pipeline, and public URL to share on your resume.",
                        "skills": ["AWS", "CI/CD", "GitHub Actions", "Docker"],
                        "estimated_hours": 12
                    },
                    "assessment": "AWS"
                }
            ]
        }

        phases = roadmap_templates.get(role_name, roadmap_templates["Full Stack Developer"])

        roadmap = Roadmap(
            user_id=user_id,
            target_role_id=target_role_id,
            title=f"Personalized Career Roadmap: {role_name}",
            description=f"A structured, milestone-driven pathway to bridge all technical gaps and achieve full employability readiness as a {role_name}.",
            total_phases=len(phases),
            current_phase=1,
            progress_pct=16.6
        )
        db.add(roadmap)
        db.commit()
        db.refresh(roadmap)

        for p_data in phases:
            status = "in_progress" if p_data["phase"] == 1 else "not_started"
            item = RoadmapItem(
                roadmap_id=roadmap.id,
                phase_number=p_data["phase"],
                title=p_data["title"],
                skill_name=p_data["skill"],
                category=p_data["category"],
                why_learn=p_data["why"],
                prerequisites_json=json.dumps(p_data["prerequisites"]),
                learning_objectives_json=json.dumps(p_data["objectives"]),
                suggested_resources_json=json.dumps(p_data["resources"]),
                mini_task_json=json.dumps(p_data["task"]),
                project_json=json.dumps(p_data["project"]),
                assessment_skill=p_data.get("assessment"),
                status=status
            )
            db.add(item)

        db.commit()
        db.refresh(roadmap)
        return roadmap

recommendation_service = RecommendationService()
