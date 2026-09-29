import json
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.profile import StudentProfile
from app.models.skill import StudentSkill, Skill
from app.models.project import Project
from app.models.resume import Resume, ResumeAnalysis
from app.models.target_role import TargetRole
from app.models.assessment import AssessmentAttempt
from app.models.evidence import SkillEvidence
from app.models.github import GitHubProfile
from app.models.skill_gap import SkillGapAnalysis

class SkillGapService:
    # Known taxonomy metadata
    SKILL_METADATA = {
        "React": {
            "category": "Frontend",
            "why": "React is the standard industry library for building scalable, component-based user interfaces.",
            "rec_missing": "Complete the React fundamentals track and build a full-featured single-page application with state management.",
            "rec_improve": "Add custom hooks, unit testing, and state management (Zustand/Redux) to an existing project."
        },
        "Node.js": {
            "category": "Backend",
            "why": "Node.js allows high-throughput asynchronous backend service development using modern JavaScript/TypeScript.",
            "rec_missing": "Build a modular REST API using Express or Fastify with JWT authentication and validation.",
            "rec_improve": "Implement streaming, database connection pooling, and error middleware in your Node.js services."
        },
        "FastAPI": {
            "category": "Backend",
            "why": "FastAPI provides modern, high-performance, asynchronous Python backend APIs with automatic OpenAPI docs and Pydantic validation.",
            "rec_missing": "Build an asynchronous CRUD service with dependency injection and OpenAPI documentation.",
            "rec_improve": "Add background worker tasks, Redis caching, and async SQLAlchemy integration."
        },
        "Django": {
            "category": "Backend",
            "why": "Django offers a robust, batteries-included Python framework for rapid enterprise web application development.",
            "rec_missing": "Build a full-stack Django or Django REST Framework web application with ORM models.",
            "rec_improve": "Implement custom user managers, Celery background queues, and optimized querysets."
        },
        "PostgreSQL": {
            "category": "Database",
            "why": "PostgreSQL is the gold standard open-source relational database known for ACID compliance, indexing power, and JSON support.",
            "rec_missing": "Design a normalized relational schema with foreign keys, constraints, and write complex JOIN queries.",
            "rec_improve": "Add composite indexes, analyze query execution plans with EXPLAIN ANALYZE, and practice transactions."
        },
        "Docker": {
            "category": "DevOps",
            "why": "Containerization ensures your application runs consistently across development, staging, and production environments.",
            "rec_missing": "Write multi-stage Dockerfiles for your frontend and backend, and create a docker-compose.yml to orchestrate them.",
            "rec_improve": "Optimize Docker image layer caching, minimize image size using Alpine/distroless, and document container deployment."
        },
        "AWS": {
            "category": "Cloud",
            "why": "AWS is the leading cloud infrastructure provider; understanding S3, EC2, ECS, and Lambda is vital for modern deployments.",
            "rec_missing": "Deploy a containerized application to AWS ECS/App Runner and configure an S3 bucket for file uploads.",
            "rec_improve": "Set up IAM least-privilege security roles, CloudWatch logging, and an RDS managed database instance."
        },
        "Git": {
            "category": "Tools",
            "why": "Git version control and collaborative branching workflows (PRs, code reviews) are required in 100% of engineering jobs.",
            "rec_missing": "Publish your project code on GitHub with semantic commit messages, feature branches, and pull requests.",
            "rec_improve": "Demonstrate branch protection rules, interactive rebasing, and CI/CD workflow automation."
        },
        "Redis": {
            "category": "Database",
            "why": "Redis is the industry standard in-memory data store for caching, session management, and rate limiting.",
            "rec_missing": "Integrate Redis into an existing API for endpoint caching and session token management.",
            "rec_improve": "Implement Redis Pub/Sub, distributed rate limiting, or Celery task brokers."
        },
        "CI/CD": {
            "category": "DevOps",
            "why": "Automated testing and deployment pipelines ensure code quality and rapid delivery in continuous deployment environments.",
            "rec_missing": "Set up a GitHub Actions workflow that runs linting, unit tests, and build checks on every push.",
            "rec_improve": "Add automated container building, security vulnerability scanning, and staging deployment jobs."
        },
        "Python": {
            "category": "Programming",
            "why": "Python is a premier general-purpose language powering backend APIs, automation, data science, and AI/ML workflows.",
            "rec_missing": "Build algorithmic solutions and structured backend applications in Python.",
            "rec_improve": "Practice type annotations, generators, context managers, and async concurrency in Python."
        },
        "JavaScript": {
            "category": "Programming",
            "why": "JavaScript powers all modern web applications on both the browser and server.",
            "rec_missing": "Master closures, async/await promises, the event loop, and modern ES6+ features.",
            "rec_improve": "Adopt TypeScript for type-safety and robust enterprise architecture."
        },
        "TypeScript": {
            "category": "Programming",
            "why": "TypeScript adds static typing to JavaScript, catching bugs during development and improving codebase maintainability.",
            "rec_missing": "Migrate a React or Node.js project to TypeScript using interfaces, generics, and strict mode.",
            "rec_improve": "Utilize advanced utility types, discriminative unions, and strict generic constraints."
        }
    }

    @classmethod
    def calculate_skill_gap(
        cls,
        db: Session,
        user_id: int,
        target_role: TargetRole
    ) -> SkillGapAnalysis:
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
        student_skills = db.query(StudentSkill).filter(StudentSkill.profile_id == profile.id).all() if profile else []
        projects = db.query(Project).filter(Project.profile_id == profile.id).all() if profile else []
        resumes = db.query(Resume).filter(Resume.user_id == user_id).all()
        attempts = db.query(AssessmentAttempt).filter(AssessmentAttempt.user_id == user_id, AssessmentAttempt.passed == True).all()
        github = db.query(GitHubProfile).filter(GitHubProfile.user_id == user_id).first()

        # Build lookup maps for evidence
        student_skill_names = {s.skill.name.lower(): s for s in student_skills if s.skill}
        
        # Parse target role required & preferred skills
        required_skills = json.loads(target_role.required_skills_json) if target_role.required_skills_json else []
        preferred_skills = json.loads(target_role.preferred_skills_json) if target_role.preferred_skills_json else []
        all_target_skills = required_skills + preferred_skills

        # Project tech mapping
        project_techs_map = {}
        for p in projects:
            try:
                techs = json.loads(p.technologies_json)
                for t in techs:
                    t_lower = t.lower()
                    if t_lower not in project_techs_map:
                        project_techs_map[t_lower] = []
                    project_techs_map[t_lower].append(p.title)
            except Exception:
                pass

        # Assessment map
        passed_assessment_skills = {a.assessment.skill_name.lower(): a.score_percentage for a in attempts if a.assessment}

        # GitHub language & topics map
        github_detected = []
        if github and github.evidence_detected_json:
            try:
                github_detected = [g.lower() for g in json.loads(github.evidence_detected_json)]
            except Exception:
                pass

        gaps = []
        category_stats = {}
        total_weight = 0
        matched_weight = 0
        evidence_weight = 0

        for skill_name in all_target_skills:
            is_req = skill_name in required_skills
            weight = 2.0 if is_req else 1.0
            total_weight += weight

            s_lower = skill_name.lower()
            meta = cls.SKILL_METADATA.get(skill_name, {
                "category": "Core Technical",
                "why": f"{skill_name} is an important industry capability for the {target_role.title} role.",
                "rec_missing": f"Learn foundational concepts of {skill_name} and build a practical implementation.",
                "rec_improve": f"Deepen your expertise in {skill_name} by building an end-to-end project with automated tests."
            })
            cat = meta["category"]
            if cat not in category_stats:
                category_stats[cat] = {"total": 0, "matched": 0, "evidence_score": 0}
            category_stats[cat]["total"] += 1

            # Check evidence streams
            evidence_list = []
            has_student_claim = s_lower in student_skill_names
            
            # Project evidence
            if s_lower in project_techs_map:
                for proj_name in project_techs_map[s_lower]:
                    evidence_list.append(f"Project: {proj_name}")
            
            # Assessment evidence
            if s_lower in passed_assessment_skills:
                evidence_list.append(f"Skill Assessment: {int(passed_assessment_skills[s_lower])}% Verified")

            # GitHub evidence
            if s_lower in github_detected or (github and s_lower in github.username.lower()):
                evidence_list.append("GitHub repository code detected")

            # Status determination
            # strong: claim + at least 1 strong evidence (project or assessment)
            # developing: claim exists, or partial evidence
            # needs_improvement: claim exists but 0 project/assessment evidence
            # missing: not claimed and no evidence
            if has_student_claim and len(evidence_list) >= 2:
                status = "strong"
                matched_weight += weight
                evidence_weight += weight
                category_stats[cat]["matched"] += 1
                category_stats[cat]["evidence_score"] += 1
                what_missing = "None. Well backed by verifiable project & assessment evidence."
                rec = "Continue keeping your repository active and highlight this as a primary strength on your resume."
            elif has_student_claim and len(evidence_list) == 1:
                status = "developing"
                matched_weight += weight * 0.75
                evidence_weight += weight * 0.5
                category_stats[cat]["matched"] += 0.8
                category_stats[cat]["evidence_score"] += 0.5
                what_missing = "Has initial evidence, but additional assessment or production project will solidify proficiency."
                rec = meta["rec_improve"]
            elif has_student_claim and len(evidence_list) == 0:
                status = "needs_improvement"
                matched_weight += weight * 0.4
                evidence_weight += 0
                category_stats[cat]["matched"] += 0.4
                what_missing = "Listed on profile, but missing any project, repository, or assessment evidence."
                rec = meta["rec_improve"]
            elif not has_student_claim and len(evidence_list) > 0:
                status = "developing"
                matched_weight += weight * 0.6
                evidence_weight += weight * 0.6
                category_stats[cat]["matched"] += 0.6
                category_stats[cat]["evidence_score"] += 0.6
                what_missing = "Evidence detected from repositories, but not formally added to your student profile."
                rec = f"Add {skill_name} to your profile skills to reflect your practical experience."
            else:
                status = "missing"
                what_missing = "Skill is not present on your profile and no project/code evidence exists."
                rec = meta["rec_missing"]

            gaps.append({
                "skill": skill_name,
                "category": cat,
                "status": status,
                "importance": "critical" if (is_req and status in ["missing", "needs_improvement"]) else ("high" if is_req else "preferred"),
                "why_it_matters": meta["why"],
                "current_evidence": evidence_list,
                "what_is_missing": what_missing,
                "recommendation": rec
            })

        # Calculate explainable sub-metrics
        skill_cov = round((matched_weight / total_weight) * 100, 1) if total_weight > 0 else 0.0
        evid_cov = round((evidence_weight / total_weight) * 100, 1) if total_weight > 0 else 0.0
        proj_score = min(100.0, round((len(projects) / 3.0) * 100, 1))
        resume_score = 90.0 if resumes else 25.0
        assess_score = min(100.0, round((len(attempts) / 4.0) * 100, 1))

        # Transparent overall Profile Readiness formula
        # 35% Skill coverage + 25% Evidence coverage + 20% Projects + 10% Resume + 10% Assessments
        overall_readiness = round(
            (skill_cov * 0.35) +
            (evid_cov * 0.25) +
            (proj_score * 0.20) +
            (resume_score * 0.10) +
            (assess_score * 0.10),
            1
        )

        # Build category breakdown
        categories_data = []
        for cat, val in category_stats.items():
            sc = int(round((val["matched"] / val["total"]) * 100)) if val["total"] > 0 else 0
            categories_data.append({
                "category": cat,
                "score": sc,
                "required_count": val["total"],
                "matched_count": int(round(val["matched"]))
            })

        # Generate Actionable Next Steps
        critical_missing = [g for g in gaps if g["status"] in ["missing", "needs_improvement"] and g["importance"] in ["critical", "high"]]
        next_steps = []
        step_num = 1
        if critical_missing:
            top_gap = critical_missing[0]
            next_steps.append({
                "step_number": step_num,
                "title": f"Master {top_gap['skill']} Fundamentals",
                "description": f"Learn key concepts and prepare to build a practical container/module for {top_gap['skill']}.",
                "action_type": "learn",
                "action_label": "Start Learning",
                "action_link": "/roadmap"
            })
            step_num += 1
            next_steps.append({
                "step_number": step_num,
                "title": f"Build a {top_gap['skill']} Practice Project",
                "description": f"Create verifiable evidence by building and containerizing a backend service with {top_gap['skill']}.",
                "action_type": "project",
                "action_label": "View Project Ideas",
                "action_link": "/skill-gap"
            })
            step_num += 1

        if len(attempts) < 2:
            next_steps.append({
                "step_number": step_num,
                "title": "Validate Skills via Technical Assessment",
                "description": "Take 10-minute targeted assessments to add verified badge evidence to your profile.",
                "action_type": "assessment",
                "action_label": "Take Assessment",
                "action_link": "/assessments"
            })
            step_num += 1

        if not resumes:
            next_steps.append({
                "step_number": step_num,
                "title": "Upload Your Resume for AI Scan",
                "description": "Scan your resume against ATS criteria and identify evidence gaps.",
                "action_type": "resume",
                "action_label": "Upload Resume",
                "action_link": "/profile"
            })

        # Generate Tailored Gap Projects
        recommended_projects = [
            {
                "title": "Containerized Microservices E-Commerce API",
                "description": "Architect a high-performance REST API with authentication, PostgreSQL relational schema, Redis caching, and full Docker containerization.",
                "skills": ["Docker", "FastAPI", "PostgreSQL", "Redis"],
                "difficulty": "Intermediate",
                "duration": "7-10 days",
                "impact": "Bridges critical DevOps, database optimization, and caching gaps in one portfolio project."
            },
            {
                "title": "Real-Time Collaborative Workspace Dashboard",
                "description": "Develop a responsive React dashboard with WebSockets, optimistic UI updates, state management, and automated GitHub Actions CI/CD pipeline.",
                "skills": ["React", "TypeScript", "CI/CD", "Tailwind CSS"],
                "difficulty": "Advanced",
                "duration": "10-14 days",
                "impact": "Demonstrates enterprise frontend architecture, type safety, and automated deployment."
            },
            {
                "title": "Cloud-Native Task Processing Queue",
                "description": "Build an asynchronous worker engine with AWS S3 file processing, background workers, and comprehensive unit/integration test coverage.",
                "skills": ["AWS", "Python", "Testing", "Docker"],
                "difficulty": "Intermediate",
                "duration": "5-7 days",
                "impact": "Provides proof of cloud infrastructure handling, unit testing, and async architecture."
            }
        ]

        # Save or update SkillGapAnalysis
        existing = db.query(SkillGapAnalysis).filter(
            SkillGapAnalysis.user_id == user_id,
            SkillGapAnalysis.target_role_name == target_role.title
        ).first()

        if not existing:
            analysis = SkillGapAnalysis(
                user_id=user_id,
                target_role_id=target_role.id,
                target_role_name=target_role.title,
                overall_readiness_pct=overall_readiness,
                skill_coverage_pct=skill_cov,
                evidence_coverage_pct=evid_cov,
                project_score_pct=proj_score,
                resume_score_pct=resume_score,
                assessment_score_pct=assess_score,
                gaps_json=json.dumps(gaps),
                category_breakdown_json=json.dumps(categories_data),
                recommendations_json=json.dumps(next_steps),
                recommended_projects_json=json.dumps(recommended_projects)
            )
            db.add(analysis)
        else:
            existing.overall_readiness_pct = overall_readiness
            existing.skill_coverage_pct = skill_cov
            existing.evidence_coverage_pct = evid_cov
            existing.project_score_pct = proj_score
            existing.resume_score_pct = resume_score
            existing.assessment_score_pct = assess_score
            existing.gaps_json = json.dumps(gaps)
            existing.category_breakdown_json = json.dumps(categories_data)
            existing.recommendations_json = json.dumps(next_steps)
            existing.recommended_projects_json = json.dumps(recommended_projects)
            analysis = existing

        # Update profile readiness
        if profile:
            profile.profile_readiness_pct = overall_readiness
            profile.target_role_id = target_role.id

        db.commit()
        db.refresh(analysis)
        return analysis

skill_gap_service = SkillGapService()
