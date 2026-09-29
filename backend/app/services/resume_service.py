import os
import io
from typing import Dict, Any, Tuple
import pypdf
from docx import Document
from app.services.ai_service import ai_service

class ResumeService:
    @staticmethod
    def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
        ext = os.path.splitext(filename)[1].lower()
        extracted_text = ""

        try:
            if ext == ".pdf":
                reader = pypdf.PdfReader(io.BytesIO(file_bytes))
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + "\n"
            elif ext in [".docx", ".doc"]:
                doc = Document(io.BytesIO(file_bytes))
                for para in doc.paragraphs:
                    extracted_text += para.text + "\n"
            else:
                extracted_text = file_bytes.decode("utf-8", errors="ignore")
        except Exception as e:
            print(f"[ResumeService] Error parsing document text: {e}")
            extracted_text = file_bytes.decode("utf-8", errors="ignore")

        return extracted_text.strip()

    @staticmethod
    async def process_resume_content(text: str) -> Dict[str, Any]:
        """
        Runs AI parsing on resume text and extracts structured intelligence.
        """
        analysis = await ai_service.analyze_resume_text(text)
        return analysis

resume_service = ResumeService()
