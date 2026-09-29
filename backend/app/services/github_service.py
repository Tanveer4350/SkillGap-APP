import httpx
import json
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.github import GitHubProfile
from app.models.evidence import SkillEvidence

class GitHubService:
    @staticmethod
    async def fetch_and_sync_github_data(db: Session, user_id: int, username: str) -> GitHubProfile:
        """
        Fetches public GitHub repositories and extracts technical language & topic evidence.
        """
        headers = {"User-Agent": "SkillGap-Platform"}
        user_data = {}
        repos_data = []

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                user_res = await client.get(f"https://api.github.com/users/{username}", headers=headers)
                if user_res.status_code == 200:
                    user_data = user_res.json()
                
                repo_res = await client.get(f"https://api.github.com/users/{username}/repos?per_page=30&sort=updated", headers=headers)
                if repo_res.status_code == 200:
                    repos_data = repo_res.json()
        except Exception as e:
            print(f"[GitHubService] Network warning when fetching GitHub API for {username}: {e}")

        # Compute language distribution
        lang_counts = {}
        total_repos = len(repos_data)
        total_stars = sum(r.get("stargazers_count", 0) for r in repos_data) if repos_data else 0
        detected_skills = set()

        processed_repos = []
        for r in repos_data:
            lang = r.get("language")
            if lang:
                lang_counts[lang] = lang_counts.get(lang, 0) + 1
                detected_skills.add(lang)
            
            topics = r.get("topics", [])
            for t in topics:
                detected_skills.add(t.capitalize())

            processed_repos.append({
                "name": r.get("name"),
                "description": r.get("description") or "Public repository",
                "language": lang,
                "stars": r.get("stargazers_count", 0),
                "forks": r.get("forks_count", 0),
                "url": r.get("html_url"),
                "updated_at": r.get("updated_at")
            })

        # Calculate percentages
        lang_breakdown = {}
        total_lang_count = sum(lang_counts.values()) or 1
        for l, count in lang_counts.items():
            lang_breakdown[l] = round((count / total_lang_count) * 100, 1)

        # Upsert GitHubProfile record
        profile = db.query(GitHubProfile).filter(GitHubProfile.user_id == user_id).first()
        if not profile:
            profile = GitHubProfile(
                user_id=user_id,
                username=username,
                avatar_url=user_data.get("avatar_url", f"https://github.com/{username}.png"),
                public_repos_count=user_data.get("public_repos", total_repos),
                followers_count=user_data.get("followers", 0),
                total_stars_count=total_stars,
                languages_breakdown_json=json.dumps(lang_breakdown),
                repositories_json=json.dumps(processed_repos[:12]),
                evidence_detected_json=json.dumps(list(detected_skills))
            )
            db.add(profile)
        else:
            profile.username = username
            profile.avatar_url = user_data.get("avatar_url", profile.avatar_url or f"https://github.com/{username}.png")
            profile.public_repos_count = user_data.get("public_repos", total_repos)
            profile.total_stars_count = total_stars
            profile.languages_breakdown_json = json.dumps(lang_breakdown)
            profile.repositories_json = json.dumps(processed_repos[:12])
            profile.evidence_detected_json = json.dumps(list(detected_skills))

        # Add verified skill evidence records
        for s in detected_skills:
            existing_ev = db.query(SkillEvidence).filter(
                SkillEvidence.user_id == user_id,
                SkillEvidence.skill_name == s,
                SkillEvidence.evidence_type == "github"
            ).first()
            if not existing_ev:
                ev = SkillEvidence(
                    user_id=user_id,
                    skill_name=s,
                    evidence_type="github",
                    title=f"GitHub Public Repository Evidence ({username})",
                    description=f"Demonstrated in active public repositories for {username}.",
                    source_reference=f"GitHub: @{username}",
                    evidence_strength="moderate",
                    score_or_metric=f"{lang_counts.get(s, 1)} repos" if s in lang_counts else "Topic tag",
                    url=f"https://github.com/{username}"
                )
                db.add(ev)

        db.commit()
        db.refresh(profile)
        return profile

github_service = GitHubService()
