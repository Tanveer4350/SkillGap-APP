import json
import datetime
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal, engine, Base
from app.models.user import User
from app.models.profile import StudentProfile, Education, Experience, Certification
from app.models.skill import Skill, StudentSkill
from app.models.project import Project
from app.models.target_role import TargetRole, RoleSkill
from app.models.opportunity import JobOpportunity
from app.models.assessment import Assessment, Question, AssessmentAttempt
from app.models.evidence import SkillEvidence
from app.models.application import Application
from app.models.resume import Resume, ResumeAnalysis
from app.models.github import GitHubProfile
from app.models.notification import Notification
from app.services.skill_gap_service import skill_gap_service
from app.services.recommendation_service import recommendation_service
from app.utils.security import get_password_hash

def seed_database():
    print("[Seed] Creating database tables...")
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).filter(User.email == "alex.sharma@skillgap.dev").first():
            print("[Seed] Database already seeded.")
            return

        print("[Seed] Populating Master Skill Taxonomy...")
        skills_data = [
            # Programming Languages
            ("JavaScript", "Programming", "Versatile scripting language for frontend & backend web systems", "code"),
            ("TypeScript", "Programming", "Typed superset of JavaScript providing static type checking", "code"),
            ("Python", "Programming", "High-level language for backend APIs, data engineering, and AI", "code"),
            ("Java", "Programming", "Object-oriented language for enterprise applications and Android", "code"),
            ("C++", "Programming", "High-performance language for systems programming and low-latency systems", "code"),
            ("Kotlin", "Programming", "Modern concise language for native Android and JVM", "code"),
            
            # Frontend
            ("React", "Frontend", "Declarative component-based UI library for modern web applications", "layout"),
            ("Next.js", "Frontend", "Production React framework with Server-Side Rendering and App Router", "layout"),
            ("HTML5", "Frontend", "Semantic markup standard for web structuring and accessibility", "layout"),
            ("CSS3", "Frontend", "Styling, modern grid layouts, and animations", "layout"),
            ("Tailwind CSS", "Frontend", "Utility-first CSS framework for rapid responsive interface design", "layout"),
            ("Redux / Zustand", "Frontend", "State management for predictable global UI state", "layout"),
            
            # Backend
            ("Node.js", "Backend", "Event-driven asynchronous JavaScript runtime for backend servers", "server"),
            ("FastAPI", "Backend", "High-performance asynchronous Python API framework with OpenAPI docs", "server"),
            ("Django", "Backend", "High-level Python web framework encouraging rapid development", "server"),
            ("Spring Boot", "Backend", "Enterprise Java framework for production microservices", "server"),
            ("REST APIs", "Backend", "Stateless client-server architecture using HTTP standards", "server"),
            ("GraphQL", "Backend", "Query language for APIs offering precise client data fetching", "server"),
            
            # Database
            ("PostgreSQL", "Database", "Advanced open-source relational database with ACID compliance", "database"),
            ("MySQL", "Database", "Widely deployed relational database management system", "database"),
            ("MongoDB", "Database", "Document-oriented NoSQL database for flexible JSON schemas", "database"),
            ("Redis", "Database", "In-memory data store for sub-millisecond caching and messaging", "database"),
            
            # DevOps & Cloud
            ("Docker", "DevOps", "Containerization platform to package apps and runtime dependencies", "container"),
            ("Kubernetes", "DevOps", "Container orchestration system for automating deployment and scaling", "container"),
            ("AWS", "Cloud", "Comprehensive cloud infrastructure covering EC2, S3, ECS, RDS, Lambda", "cloud"),
            ("GCP", "Cloud", "Google Cloud Platform computing, storage, and AI services", "cloud"),
            ("CI/CD", "DevOps", "Automated continuous integration and deployment pipelines", "git-branch"),
            ("Git", "Tools", "Distributed version control system for collaborative engineering", "git-branch"),
            ("Linux", "Tools", "Command-line administration and server operating system environments", "terminal"),
            
            # AI & Data
            ("Machine Learning", "AI/ML", "Supervised and unsupervised statistical learning algorithms", "cpu"),
            ("Deep Learning", "AI/ML", "Neural networks using PyTorch / TensorFlow frameworks", "cpu"),
            ("Generative AI & LLMs", "AI/ML", "Prompt engineering, embeddings, and RAG architectures", "sparkles"),
            
            # Soft Skills
            ("Problem Solving", "Soft Skills", "Algorithmic reasoning, analytical decomposition, and debugging", "brain"),
            ("Communication", "Soft Skills", "Clear technical writing, documentation, and stakeholder collaboration", "message-square"),
            ("System Design", "Engineering", "Designing scalable distributed architectures and tradeoffs", "layers")
        ]

        skill_records = {}
        for name, cat, desc, icon in skills_data:
            s = Skill(name=name, category=cat, description=desc, icon=icon)
            db.add(s)
            db.commit()
            db.refresh(s)
            skill_records[name] = s

        print("[Seed] Creating Target Career Roles...")
        roles_data = [
            {
                "title": "Full Stack Developer",
                "category": "Software Engineering",
                "description": "Builds end-to-end web applications covering interactive frontend UIs, robust backend APIs, relational databases, containerization, and cloud deployment.",
                "average_salary": "$85,000 - $130,000",
                "growth_rate": "+24% (High Demand)",
                "icon": "layers",
                "required": ["React", "JavaScript", "Python", "FastAPI", "PostgreSQL", "Docker", "Git"],
                "preferred": ["TypeScript", "AWS", "Redis", "CI/CD", "Tailwind CSS"],
                "responsibilities": [
                    "Design and develop responsive, performant user interfaces using React and modern CSS",
                    "Build and maintain secure RESTful APIs with authentication, validation, and documentation",
                    "Architect normalized relational schemas and optimize database queries",
                    "Containerize application services using Docker and orchestrate with Docker Compose"
                ]
            },
            {
                "title": "Backend Developer",
                "category": "Backend Engineering",
                "description": "Specializes in high-throughput server-side services, database architecture, caching layers, distributed transactions, and microservices.",
                "average_salary": "$90,000 - $140,000",
                "growth_rate": "+22%",
                "icon": "server",
                "required": ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Git", "REST APIs"],
                "preferred": ["AWS", "CI/CD", "Kubernetes", "System Design"],
                "responsibilities": [
                    "Implement low-latency backend endpoints with async concurrency and caching",
                    "Manage database migrations, connection pooling, and complex SQL transactions",
                    "Ensure high availability, resilience, and rate-limiting across microservices"
                ]
            },
            {
                "title": "Cloud & DevOps Engineer",
                "category": "Infrastructure",
                "description": "Focuses on cloud infrastructure provisioning, CI/CD automation pipelines, container orchestration, monitoring, and zero-downtime deployments.",
                "average_salary": "$95,000 - $150,000",
                "growth_rate": "+28% (Very High)",
                "icon": "cloud",
                "required": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Git", "Python"],
                "preferred": ["PostgreSQL", "Redis", "TypeScript"],
                "responsibilities": [
                    "Maintain continuous integration and deployment pipelines with GitHub Actions",
                    "Provision immutable cloud infrastructure using Terraform / CloudFormation",
                    "Manage multi-cluster Kubernetes deployments, load balancers, and monitoring"
                ]
            },
            {
                "title": "Data Scientist / AI Engineer",
                "category": "AI & Data",
                "description": "Applies machine learning models, statistical inference, LLM integrations, embeddings, and data pipelines to extract intelligence.",
                "average_salary": "$95,000 - $145,000",
                "growth_rate": "+32% (Explosive)",
                "icon": "cpu",
                "required": ["Python", "Machine Learning", "PostgreSQL", "Generative AI & LLMs", "Git"],
                "preferred": ["Deep Learning", "Docker", "FastAPI", "AWS"],
                "responsibilities": [
                    "Train, evaluate, and deploy predictive ML models and RAG pipelines",
                    "Perform exploratory data analysis and feature engineering on structured/unstructured datasets"
                ]
            }
        ]

        role_records = {}
        for r_item in roles_data:
            tr = TargetRole(
                title=r_item["title"],
                category=r_item["category"],
                description=r_item["description"],
                average_salary=r_item["average_salary"],
                growth_rate=r_item["growth_rate"],
                icon=r_item["icon"],
                required_skills_json=json.dumps(r_item["required"]),
                preferred_skills_json=json.dumps(r_item["preferred"]),
                responsibilities_json=json.dumps(r_item["responsibilities"])
            )
            db.add(tr)
            db.commit()
            db.refresh(tr)
            role_records[r_item["title"]] = tr

        print("[Seed] Creating Interactive Technical Assessments...")
        assessments_data = [
            {
                "title": "React Component Architecture & Hooks Assessment",
                "skill": "React",
                "category": "Frontend",
                "difficulty": "intermediate",
                "time": 15,
                "pass": 70,
                "desc": "Tests your mastery of state synchronization, hook dependencies, memoization, and component lifecycle.",
                "questions": [
                    {
                        "text": "What is the primary consequence of omitting the dependency array in a `useEffect` hook?",
                        "type": "mcq",
                        "options": [
                            "The effect will never execute.",
                            "The effect runs after every single render of the component.",
                            "The effect runs only once when the component mounts.",
                            "React will throw a runtime syntax error."
                        ],
                        "correct": 1,
                        "explanation": "When no dependency array is passed to `useEffect`, React executes the effect function after every initial mount and subsequent re-render."
                    },
                    {
                        "text": "Given this code snippet, why might `handleClick` produce stale state?",
                        "type": "debugging",
                        "snippet": "const [count, setCount] = useState(0);\nconst handleClick = () => {\n  setCount(count + 1);\n  setCount(count + 1);\n};",
                        "options": [
                            "`setCount` cannot be called twice in the same function.",
                            "`count` in both calls references the state value from the same render pass.",
                            "State updates in React are synchronous and override each other.",
                            "`useState` requires a callback parameter."
                        ],
                        "correct": 1,
                        "explanation": "Both `setCount` calls capture `count` from the current render snapshot. To update based on previous state consecutively, use functional updates: `setCount(prev => prev + 1)`."
                    },
                    {
                        "text": "Which React hook is specifically designed to memoize the computed result of an expensive calculation?",
                        "type": "mcq",
                        "options": [
                            "`useCallback`",
                            "`useMemo`",
                            "`useRef`",
                            "`useReducer`"
                        ],
                        "correct": 1,
                        "explanation": "`useMemo` caches the return value of a function between re-renders until its specified dependencies change."
                    },
                    {
                        "text": "When building an accessible form component in React, why is using `<label htmlFor='email'>` preferred over a generic `<div>`?",
                        "type": "scenario",
                        "options": [
                            "It automatically adds CSS styling.",
                            "It programmatically binds the descriptive text to the input for screen readers and expands the clickable target area.",
                            "It enables automatic form submission without a button.",
                            "It is required by Vite."
                        ],
                        "correct": 1,
                        "explanation": "Semantic labels paired via `htmlFor` associate text with input elements for accessibility tools (WCAG compliance) and focus the input upon clicking the label."
                    }
                ]
            },
            {
                "title": "PostgreSQL Schema Design & Query Optimization",
                "skill": "PostgreSQL",
                "category": "Database",
                "difficulty": "intermediate",
                "time": 15,
                "pass": 70,
                "desc": "Validates your understanding of relational constraints, indexing mechanisms, transactions, and execution plans.",
                "questions": [
                    {
                        "text": "Which index type is default and best suited in PostgreSQL for range queries (`<`, `<=`, `>=`, `BETWEEN`) and equality lookups?",
                        "type": "mcq",
                        "options": [
                            "Hash Index",
                            "B-Tree Index",
                            "GIN Index",
                            "BRIN Index"
                        ],
                        "correct": 1,
                        "explanation": "B-Tree indexes are the default and maintain a balanced tree structure ideal for sorting, equality, and range comparisons."
                    },
                    {
                        "text": "What does running `EXPLAIN ANALYZE` on a query do?",
                        "type": "mcq",
                        "options": [
                            "It rewrites the SQL syntax to be faster without running it.",
                            "It executes the query and prints both the planner's estimates and actual wall-clock execution time per node.",
                            "It deletes temporary database tables.",
                            "It automatically creates missing foreign keys."
                        ],
                        "correct": 1,
                        "explanation": "`EXPLAIN ANALYZE` actually executes the SQL query, capturing actual execution times, loop counts, and memory usage alongside planner cost estimates."
                    },
                    {
                        "text": "What is the primary benefit of enforcing `ON DELETE CASCADE` on a foreign key constraint?",
                        "type": "scenario",
                        "options": [
                            "It prevents deletion of the parent record entirely.",
                            "It automatically removes child records when their referenced parent record is deleted, preserving referential integrity.",
                            "It indexes the foreign key column automatically.",
                            "It speeds up SELECT queries by 50%."
                        ],
                        "correct": 1,
                        "explanation": "`ON DELETE CASCADE` ensures orphan records are cleanly eliminated whenever the parent entity is removed."
                    }
                ]
            },
            {
                "title": "Docker Containerization & Orchestration",
                "skill": "Docker",
                "category": "DevOps",
                "difficulty": "intermediate",
                "time": 15,
                "pass": 70,
                "desc": "Tests container caching, multi-stage builds, port mappings, and compose networking.",
                "questions": [
                    {
                        "text": "Why are multi-stage Docker builds recommended for production deployments?",
                        "type": "mcq",
                        "options": [
                            "They allow running multiple operating systems inside one container.",
                            "They separate build dependencies from runtime assets, drastically reducing the final image size and attack surface.",
                            "They bypass Docker image layer caching.",
                            "They are required to expose network ports."
                        ],
                        "correct": 1,
                        "explanation": "Multi-stage builds allow compiling code with heavy SDKs in an initial stage and copying only the final binary/static bundle into a clean lightweight runtime image."
                    },
                    {
                        "text": "In `docker-compose.yml`, how do services on the same default bridge network discover each other?",
                        "type": "mcq",
                        "options": [
                            "By hardcoded IP addresses (e.g. 192.168.1.1)",
                            "Using the service name as an automatic DNS hostname (e.g. `db:5432`)",
                            "Via localhost port forwarding only",
                            "By mounting shared file volumes"
                        ],
                        "correct": 1,
                        "explanation": "Docker Compose creates a shared user-defined bridge network where internal DNS automatically resolves service names to container IPs."
                    },
                    {
                        "text": "What instruction in a Dockerfile sets the initial active directory for subsequent commands like RUN and CMD?",
                        "type": "mcq",
                        "options": [
                            "`CD /app`",
                            "`WORKDIR /app`",
                            "`FOLDER /app`",
                            "`ENV DIR=/app`"
                        ],
                        "correct": 1,
                        "explanation": "`WORKDIR` sets the current working directory for subsequent instructions and creates it if it does not already exist."
                    }
                ]
            }
        ]

        for a_data in assessments_data:
            a = Assessment(
                title=a_data["title"],
                skill_name=a_data["skill"],
                category=a_data["category"],
                difficulty=a_data["difficulty"],
                time_limit_mins=a_data["time"],
                pass_score=a_data["pass"],
                questions_count=len(a_data["questions"]),
                description=a_data["desc"]
            )
            db.add(a)
            db.commit()
            db.refresh(a)

            for q_data in a_data["questions"]:
                q = Question(
                    assessment_id=a.id,
                    question_text=q_data["text"],
                    question_type=q_data["type"],
                    code_snippet=q_data.get("snippet"),
                    options_json=json.dumps(q_data["options"]),
                    correct_option_index=q_data["correct"],
                    explanation=q_data["explanation"]
                )
                db.add(q)
            db.commit()

        print("[Seed] Creating Real-World Job Opportunities & Internships...")
        opps_data = [
            {
                "title": "Full Stack Engineering Intern",
                "company": "Vercel",
                "company_logo": "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
                "location": "San Francisco, CA / Remote",
                "type": "internship",
                "workplace_type": "remote",
                "experience_level": "Internship (Graduating 2026/2027)",
                "stipend_or_salary": "$45 - $55 / hour",
                "required": ["React", "JavaScript", "TypeScript", "Node.js", "Git"],
                "preferred": ["Next.js", "Docker", "PostgreSQL", "Tailwind CSS"],
                "responsibilities": [
                    "Collaborate with senior engineers to build accessible frontend UI components for developer tooling",
                    "Implement performant backend API endpoints with comprehensive automated tests",
                    "Participate in daily standups, code reviews, and architectural RFC discussions"
                ],
                "qualifications": [
                    "Pursuing a Bachelor's or Master's degree in Computer Science or related engineering field",
                    "Strong foundation in web technologies, component architecture, and modern JavaScript",
                    "Demonstrated portfolio projects or open-source contributions"
                ],
                "description": "Join Vercel's product engineering team to build world-class tools for millions of web developers. You'll gain hands-on experience deploying modern React architectures and scalable APIs.",
                "deadline": "Nov 30, 2026",
                "apply_url": "https://vercel.com/careers"
            },
            {
                "title": "Junior Backend Engineer",
                "company": "Stripe",
                "company_logo": "https://stripe.com/favicon.ico",
                "location": "Seattle, WA / Hybrid",
                "type": "full-time",
                "workplace_type": "hybrid",
                "experience_level": "Entry Level (0-1 yrs)",
                "stipend_or_salary": "$115,000 - $135,000 / year",
                "required": ["Python", "FastAPI", "PostgreSQL", "REST APIs", "Git"],
                "preferred": ["Docker", "Redis", "AWS", "CI/CD"],
                "responsibilities": [
                    "Design and implement secure payment orchestration microservices handling high-volume transactions",
                    "Optimize PostgreSQL relational queries and implement Redis caching layers for sub-millisecond response",
                    "Collaborate with security and infrastructure teams to ensure 99.999% platform availability"
                ],
                "qualifications": [
                    "Solid understanding of object-oriented / functional programming in Python",
                    "Knowledge of database schemas, ACID transactions, and RESTful principles",
                    "Passion for writing clean, testable, and well-documented backend services"
                ],
                "description": "Build the economic infrastructure of the internet. As a Junior Backend Engineer at Stripe, you will contribute directly to core financial APIs and global payment rails.",
                "deadline": "Dec 15, 2026",
                "apply_url": "https://stripe.com/jobs"
            },
            {
                "title": "Cloud & DevOps Intern",
                "company": "Datadog",
                "company_logo": "https://www.datadoghq.com/favicon.ico",
                "location": "New York, NY / Remote",
                "type": "internship",
                "workplace_type": "remote",
                "experience_level": "Internship (Summer 2026)",
                "stipend_or_salary": "$42 - $50 / hour",
                "required": ["Docker", "Linux", "Python", "Git", "CI/CD"],
                "preferred": ["Kubernetes", "AWS", "PostgreSQL"],
                "responsibilities": [
                    "Automate testing and container build workflows using GitHub Actions",
                    "Assist in monitoring container health metrics and cluster observability dashboards",
                    "Document infrastructure deployment playbooks and best practices"
                ],
                "qualifications": [
                    "Familiarity with Linux shell environments and Docker containerization",
                    "Basic scripting skills in Python or Bash",
                    "Eagerness to learn cloud observability and distributed infrastructure"
                ],
                "description": "Datadog is looking for a curious, hands-on Cloud & DevOps Intern to help improve our continuous integration pipelines and scalable cloud telemetry systems.",
                "deadline": "Oct 25, 2026",
                "apply_url": "https://datadoghq.com/careers"
            },
            {
                "title": "Associate Software Engineer",
                "company": "Snowflake",
                "company_logo": "https://www.snowflake.com/favicon.ico",
                "location": "San Mateo, CA / On-site",
                "type": "full-time",
                "workplace_type": "on-site",
                "experience_level": "Entry Level (0-2 yrs)",
                "stipend_or_salary": "$120,000 - $145,000 / year",
                "required": ["Python", "PostgreSQL", "Git", "Problem Solving"],
                "preferred": ["Docker", "FastAPI", "AWS", "Machine Learning"],
                "responsibilities": [
                    "Develop data processing pipelines and APIs integrating with the Snowflake Data Cloud",
                    "Write automated integration tests and benchmark database query workloads"
                ],
                "qualifications": [
                    "Strong grasp of data structures, algorithms, and relational databases",
                    "Excellent problem-solving mindset and teamwork abilities"
                ],
                "description": "Snowflake delivers the Data Cloud — a global network where thousands of organizations mobilize data with near-unlimited scale, concurrency, and performance.",
                "deadline": "Dec 31, 2026",
                "apply_url": "https://snowflake.com/careers"
            }
        ]

        opp_records = []
        for opp in opps_data:
            jo = JobOpportunity(
                title=opp["title"],
                company=opp["company"],
                company_logo=opp["company_logo"],
                location=opp["location"],
                type=opp["type"],
                workplace_type=opp["workplace_type"],
                experience_level=opp["experience_level"],
                stipend_or_salary=opp["stipend_or_salary"],
                required_skills_json=json.dumps(opp["required"]),
                preferred_skills_json=json.dumps(opp["preferred"]),
                responsibilities_json=json.dumps(opp["responsibilities"]),
                qualifications_json=json.dumps(opp["qualifications"]),
                description=opp["description"],
                deadline=opp["deadline"],
                apply_url=opp["apply_url"]
            )
            db.add(jo)
            db.commit()
            db.refresh(jo)
            opp_records.append(jo)

        print("[Seed] Creating Primary Demo Student (Alex Sharma)...")
        demo_user = User(
            email="alex.sharma@skillgap.dev",
            hashed_password=get_password_hash("password123"),
            full_name="Alex Sharma",
            role="student",
            college="ABC Institute of Technology",
            degree="B.Tech Computer Science",
            graduation_year=2026,
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=AlexSharma"
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

        # Student Profile
        target_role = role_records["Full Stack Developer"]
        demo_profile = StudentProfile(
            user_id=demo_user.id,
            bio="Pre-final year Computer Science student passionate about full-stack web architectures, clean RESTful APIs, and scalable distributed applications.",
            branch="Computer Science & Engineering",
            location="Bangalore / Remote",
            target_role_id=target_role.id,
            profile_completion_pct=85.0,
            profile_readiness_pct=78.0,
            github_username="alexsharma-dev",
            linkedin_url="https://linkedin.com/in/alex-sharma",
            portfolio_url="https://alexsharma.dev",
            earned_badges_json='["First Profile", "First Project", "Skill Explorer", "Assessment Master"]',
            experience_points=450
        )
        db.add(demo_profile)
        db.commit()
        db.refresh(demo_profile)

        # Education
        edu = Education(
            profile_id=demo_profile.id,
            institution="ABC Institute of Technology",
            degree="Bachelor of Technology",
            field_of_study="Computer Science & Engineering",
            start_year=2022,
            end_year=2026,
            grade="8.8 CGPA",
            current=1
        )
        db.add(edu)

        # Experience
        exp = Experience(
            profile_id=demo_profile.id,
            company="TechNova Labs",
            role="Frontend Engineering Intern",
            location="Remote",
            start_date="Jun 2025",
            end_date="Aug 2025",
            current=0,
            description="Engineered modular React components, integrated RESTful endpoints, and improved client-side rendering speed by 30%."
        )
        db.add(exp)

        # Certifications
        cert = Certification(
            profile_id=demo_profile.id,
            name="Meta Front-End Developer Certificate",
            issuing_org="Meta / Coursera",
            issue_date="May 2025",
            credential_url="https://coursera.org/verify/demo-meta"
        )
        db.add(cert)

        # Student Skills
        student_skills_seed = [
            ("React", "advanced", "self"),
            ("JavaScript", "advanced", "self"),
            ("Python", "intermediate", "self"),
            ("FastAPI", "intermediate", "self"),
            ("PostgreSQL", "intermediate", "self"),
            ("Git", "advanced", "self"),
            ("Tailwind CSS", "advanced", "self"),
            ("HTML5", "advanced", "self"),
            ("Docker", "beginner", "self")  # Listed with low evidence = gap!
        ]

        for s_name, level, src in student_skills_seed:
            if s_name in skill_records:
                sk = skill_records[s_name]
                st_sk = StudentSkill(
                    profile_id=demo_profile.id,
                    skill_id=sk.id,
                    proficiency_level=level,
                    source=src,
                    verified=(s_name in ["React", "JavaScript", "PostgreSQL"]),
                    years_experience=2
                )
                db.add(st_sk)

        # Student Projects
        projects_seed = [
            {
                "title": "Campus Navigation & Event Discovery Platform",
                "description": "A high-performance interactive campus mapping and event reservation platform with real-time slot booking, QR check-ins, and analytics.",
                "role": "Lead Full Stack Developer",
                "duration": "6 weeks",
                "github_url": "https://github.com/alexsharma-dev/campus-nav",
                "live_url": "https://campus-nav.demo.app",
                "technologies": ["React", "JavaScript", "Tailwind CSS", "FastAPI", "PostgreSQL"],
                "difficulty": "intermediate",
                "impact": "Deployed to 1,200+ students on campus with zero downtime."
            },
            {
                "title": "AI-Powered Travel Route Assistant",
                "description": "Generates personalized daily travel itineraries based on budget, weather forecasts, and travel preferences with interactive map previews.",
                "role": "Full Stack Developer",
                "duration": "4 weeks",
                "github_url": "https://github.com/alexsharma-dev/ai-travel-planner",
                "live_url": "https://travel-ai.demo.app",
                "technologies": ["React", "Python", "FastAPI", "Git"],
                "difficulty": "intermediate",
                "impact": "Processed over 450 generated itineraries in testing."
            },
            {
                "title": "Full-Stack Airline Ticket Booking System",
                "description": "Engineered airline seat selection, concurrent booking lock management, user authentication with JWT tokens, and automated email receipts.",
                "role": "Backend & Database Developer",
                "duration": "5 weeks",
                "github_url": "https://github.com/alexsharma-dev/airline-reservation-api",
                "live_url": None,
                "technologies": ["Python", "PostgreSQL", "REST APIs", "Git"],
                "difficulty": "intermediate",
                "impact": "Benchmarked with 50 concurrent seat selection requests without double-booking collisions."
            }
        ]

        for p_data in projects_seed:
            proj = Project(
                profile_id=demo_profile.id,
                title=p_data["title"],
                description=p_data["description"],
                role=p_data["role"],
                duration=p_data["duration"],
                github_url=p_data["github_url"],
                live_url=p_data["live_url"],
                technologies_json=json.dumps(p_data["technologies"]),
                verified_skills_json=json.dumps(p_data["technologies"]),
                difficulty=p_data["difficulty"],
                impact_metrics=p_data["impact"]
            )
            db.add(proj)
            db.commit()
            db.refresh(proj)

            # Link project evidence
            for t in p_data["technologies"]:
                ev = SkillEvidence(
                    user_id=demo_user.id,
                    skill_name=t,
                    evidence_type="project",
                    title=f"Project: {proj.title}",
                    description=f"Demonstrated in '{proj.title}': {proj.description[:100]}...",
                    source_reference=f"Project #{proj.id}",
                    evidence_strength="strong" if proj.live_url else "moderate",
                    score_or_metric="Production URL" if proj.live_url else "GitHub Repo",
                    url=proj.live_url or proj.github_url
                )
                db.add(ev)

        # Assessments attempted by demo user
        react_assessment = db.query(Assessment).filter(Assessment.skill_name == "React").first()
        if react_assessment:
            attempt = AssessmentAttempt(
                user_id=demo_user.id,
                assessment_id=react_assessment.id,
                score_percentage=100.0,
                total_questions=4,
                correct_count=4,
                incorrect_count=0,
                passed=True,
                user_answers_json='{"1": 1, "2": 1, "3": 1, "4": 1}',
                feedback_json='[]'
            )
            db.add(attempt)

            # Add assessment evidence
            ev_ass = SkillEvidence(
                user_id=demo_user.id,
                skill_name="React",
                evidence_type="assessment",
                title="Verified Assessment: React",
                description="Scored 100% in SkillGap Intermediate React Assessment.",
                source_reference="Assessment #1",
                evidence_strength="strong",
                score_or_metric="100% Verified"
            )
            db.add(ev_ass)

        # GitHub Profile
        gh = GitHubProfile(
            user_id=demo_user.id,
            username="alexsharma-dev",
            avatar_url="https://github.com/alexsharma-dev.png",
            public_repos_count=8,
            followers_count=14,
            total_stars_count=22,
            languages_breakdown_json='{"JavaScript": 40.5, "Python": 35.0, "HTML/CSS": 24.5}',
            repositories_json=json.dumps([
                {"name": "campus-nav", "description": "Interactive campus navigation React web app", "language": "JavaScript", "stars": 12, "forks": 3, "url": "https://github.com/alexsharma-dev/campus-nav"},
                {"name": "ai-travel-planner", "description": "AI-assisted travel itinerary builder in Python/React", "language": "Python", "stars": 7, "forks": 1, "url": "https://github.com/alexsharma-dev/ai-travel-planner"},
                {"name": "airline-reservation-api", "description": "PostgreSQL backed RESTful booking API with ACID transactions", "language": "Python", "stars": 3, "forks": 0, "url": "https://github.com/alexsharma-dev/airline-reservation-api"}
            ]),
            evidence_detected_json='["React", "JavaScript", "Python", "FastAPI", "PostgreSQL", "HTML5"]'
        )
        db.add(gh)

        # Resume & Analysis
        demo_resume = Resume(
            user_id=demo_user.id,
            filename="Alex_Sharma_FullStack_Resume_2026.pdf",
            file_path="./uploads/demo_resume.pdf",
            file_size=184500,
            parsed_text="Alex Sharma | B.Tech Computer Science | Full Stack Developer | React, JavaScript, Python, FastAPI, PostgreSQL, Git"
        )
        db.add(demo_resume)
        db.commit()
        db.refresh(demo_resume)

        demo_analysis = ResumeAnalysis(
            resume_id=demo_resume.id,
            user_id=demo_user.id,
            extracted_name="Alex Sharma",
            extracted_email="alex.sharma@skillgap.dev",
            extracted_skills_json='["React", "JavaScript", "Python", "FastAPI", "PostgreSQL", "Git", "Tailwind CSS", "REST APIs"]',
            extracted_experience_json='[{"company": "TechNova Labs", "role": "Frontend Engineering Intern", "duration": "3 months"}]',
            extracted_projects_json='[{"title": "Campus Navigation", "description": "Interactive campus routing web app."}, {"title": "Airline Booking API", "description": "RESTful PostgreSQL booking system."}]',
            extracted_education_json='[{"institution": "ABC Institute of Technology", "degree": "B.Tech Computer Science", "grad_year": 2026}]',
            skills_found_json='["React", "JavaScript", "Python", "FastAPI", "PostgreSQL", "Git"]',
            skills_missing_json='["Docker", "AWS", "CI/CD", "Redis", "Automated Testing"]',
            weak_evidence_json=json.dumps([
                {"skill": "React", "evidence": "Demonstrated across Campus Navigation & Frontend Internship.", "status": "Strong evidence"},
                {"skill": "PostgreSQL", "evidence": "Demonstrated in Airline Booking transactional schema.", "status": "Strong evidence"},
                {"skill": "Docker", "evidence": "No project containerization or Dockerfile mentioned.", "status": "Missing evidence"}
            ]),
            missing_sections_json='["Metrics on backend throughput / query performance"]',
            improvement_suggestions_json=json.dumps([
                "Containerize your backend API with Docker and note the container deployment on your resume.",
                "Highlight AWS deployment or cloud hosting configuration.",
                "Quantify database load metrics and transaction speedups."
            ]),
            ats_score=82.0
        )
        db.add(demo_analysis)

        # Applications Kanban Seed
        app1 = Application(
            user_id=demo_user.id,
            opportunity_id=opp_records[0].id, # Vercel
            custom_title="Full Stack Engineering Intern",
            custom_company="Vercel",
            status="interview",
            match_score=85,
            applied_date=datetime.datetime.utcnow() - datetime.timedelta(days=12),
            interview_date="Oct 14, 2026 at 2:00 PM PST",
            notes="Completed take-home React component challenge. System design round next."
        )
        db.add(app1)

        app2 = Application(
            user_id=demo_user.id,
            opportunity_id=opp_records[1].id, # Stripe
            custom_title="Junior Backend Engineer",
            custom_company="Stripe",
            status="applied",
            match_score=78,
            applied_date=datetime.datetime.utcnow() - datetime.timedelta(days=4),
            notes="Submitted application with portfolio project link."
        )
        db.add(app2)

        app3 = Application(
            user_id=demo_user.id,
            opportunity_id=opp_records[2].id, # Datadog
            custom_title="Cloud & DevOps Intern",
            custom_company="Datadog",
            status="saved",
            match_score=64,
            notes="Need to complete Docker practice project before submitting application."
        )
        db.add(app3)

        # Notifications
        notifs = [
            ("New Opportunity Match", "Vercel posted Full Stack Engineering Intern matching 85% of your profile.", "opportunity", "/opportunities"),
            ("Assessment Available", "Take the Docker Technical Assessment to bridge your critical DevOps gap.", "assessment", "/assessments"),
            ("Roadmap Milestone Ready", "Phase 5 (Containerization with Docker) is now your active focus milestone.", "milestone", "/roadmap")
        ]
        for t, m, tp, lk in notifs:
            n = Notification(user_id=demo_user.id, title=t, message=m, type=tp, link=lk)
            db.add(n)

        # College Placement Cell User
        placement_user = User(
            email="placement@abctech.edu",
            hashed_password=get_password_hash("password123"),
            full_name="Dr. Priya Patel",
            role="placement_cell",
            college="ABC Institute of Technology",
            degree="Dean of Career Placements",
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaPatel"
        )
        db.add(placement_user)

        # Admin User
        admin_user = User(
            email="admin@skillgap.dev",
            hashed_password=get_password_hash("admin123"),
            full_name="SkillGap System Admin",
            role="admin",
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=SkillGapAdmin"
        )
        db.add(admin_user)

        db.commit()

        # Compute initial SkillGapAnalysis and Roadmap for Alex Sharma
        print("[Seed] Calculating initial Skill Gap Analysis and Roadmap...")
        skill_gap_service.calculate_skill_gap(db, demo_user.id, target_role)
        recommendation_service.generate_personalized_roadmap(db, demo_user.id, target_role.id)

        print("[Seed] Successfully seeded all database models, skills, questions, roles, opportunities, and Alex Sharma profile!")

    except Exception as e:
        db.rollback()
        print(f"[Seed] Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
