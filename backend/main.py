import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.pdf_parser import extract_text_from_pdf
from services.ats_engine import analyze_ats

load_dotenv(Path(__file__).resolve().parent / ".env")

app = FastAPI(
    title="FitCV - ATS Resume Matcher API",
    description="Backend API untuk memindai kecocokan CV dengan kualifikasi lowongan kerja",
    version="1.0.0"
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fitcv-malik.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
        "*"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "Online",
        "service": "FitCV ATS Matcher Engine",
        "endpoints": ["/api/scan", "/docs"]
    }

@app.post("/api/scan")
async def scan_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    # 1. Validasi format harus PDF
    if not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Hanya file dengan format .PDF yang didukung."
        )

    # 2. Baca isi file PDF
    file_bytes = await resume.read()
    extracted_text = extract_text_from_pdf(file_bytes)

    if not extracted_text:
        raise HTTPException(
            status_code=400,
            detail="File PDF tidak memiliki teks yang dapat dibaca (mungkin hasil scan gambar)."
        )

    # 3. Jalankan Algoritma Pemindaian ATS
    try:
        analysis_result = analyze_ats(extracted_text, job_description)
    except RuntimeError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error),
        ) from error

    return {
        "filename": resume.filename,
        "result": analysis_result
    }