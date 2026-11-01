"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";

interface ScanResult {
  score: number;
  matched_skills: string[];
  missing_skills: string[];
  total_required_skills: number;
  total_resume_words: number;
  summary: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const applyPreset = (type: "fullstack" | "backend") => {
    setJobDescription(
      type === "fullstack"
        ? "Dibutuhkan Full Stack Developer yang mahir menggunakan TypeScript, Next.js, React, Tailwind CSS, PostgreSQL, Git, dan Docker. Memiliki pemahaman REST API dan metodologi Agile."
        : "Dibutuhkan Backend Engineer menguasai Python, FastAPI atau Laravel, MySQL/PostgreSQL, Redis, Microservices, OAuth, dan Unit Testing. Terbiasa dengan CI/CD dan Linux server.",
    );
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Silakan unggah CV dalam format PDF terlebih dahulu.");
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMsg("Silakan masukkan deskripsi pekerjaan yang dituju.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("job_description", jobDescription);

      const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const apiUrl = rawUrl.replace(/\/+$/, "");
      const response = await fetch(`${apiUrl}/api/scan`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Pemindaian CV gagal dilakukan.");
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Tidak dapat terhubung ke layanan analisis. Pastikan server aktif.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070b16] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(20,184,166,0.12),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(37,99,235,0.10),transparent_28%)]" />

      <div className="relative mx-auto min-h-screen w-full max-w-295">
        <section className="min-w-0 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
          <header className="mb-8 flex flex-col justify-between gap-4 border-b border-teal-500/15 pb-7 md:flex-row md:items-center">
            <div className="flex min-w-0 items-start gap-3 sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-600/50 bg-slate-950/80 shadow-[0_0_28px_rgba(45,212,191,0.16)] sm:h-16 sm:w-16">
                <Image
                  src="/logo.png"
                  alt="FitCV"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain p-1"
                  priority
                />
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-teal-300/70">
                  Career Intelligence
                </p>
                <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Fit<span className="text-teal-300">CV</span>
                </h1>
                <p className="max-w-xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                  Analisis kecocokan CV dengan kebutuhan posisi secara cerdas
                  dan terukur.
                </p>
              </div>
            </div>
          </header>

          <div className="mb-8 max-w-3xl">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-teal-300">
              <Sparkles className="h-4 w-4" /> Resume intelligence berbasis AI
            </p>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Buat CV Anda lebih{" "}
              <span className="text-teal-300">relevan dan meyakinkan.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Bandingkan CV dengan kebutuhan posisi yang Anda incar. Dapatkan
              insight terukur untuk meningkatkan peluang lolos sistem ATS dan
              menarik perhatian rekruter.
            </p>
          </div>

          <form onSubmit={handleScan} className="grid gap-5 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/9 bg-[#0d1424]/85 p-5 shadow-2xl shadow-black/10 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                    Langkah 01
                  </p>
                  <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                    <FileText className="h-4 w-4 text-teal-300" /> Unggah CV
                    Anda
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Gunakan CV terbaru dalam format PDF untuk hasil terbaik.
                  </p>
                </div>
                <ShieldCheck className="h-5 w-5 shrink-0 text-slate-600" />
              </div>
              <label className="group flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#090f1d]/80 px-5 text-center transition hover:border-teal-400/60 hover:bg-teal-400/3">
                <UploadCloud className="mb-3 h-8 w-8 text-teal-300 transition group-hover:scale-105" />
                <span className="text-sm font-medium text-slate-200">
                  {file ? file.name : "Pilih file CV untuk diunggah"}
                </span>
                <span className="mt-2 text-[11px] text-slate-500">
                  PDF • Maksimal 5 MB
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              {file && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-teal-400/15 bg-teal-400/6 p-3 text-xs text-teal-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">CV siap dianalisis</span>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/9 bg-[#0d1424]/85 p-5 shadow-2xl shadow-black/10 sm:p-6">
              <div className="mb-5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                  Langkah 02
                </p>
                <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                  <BriefcaseBusiness className="h-4 w-4 text-teal-300" /> Target
                  posisi
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Tempelkan deskripsi pekerjaan yang ingin Anda lamar.
                </p>
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset("fullstack")}
                  className="cursor-pointer rounded-lg border border-white/8 bg-white/4 px-3 py-1.5 text-[11px] text-slate-300 transition hover:border-teal-400/30 hover:text-teal-200"
                >
                  Contoh Full Stack
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("backend")}
                  className="cursor-pointer rounded-lg border border-white/8 bg-white/4 px-3 py-1.5 text-[11px] text-slate-300 transition hover:border-teal-400/30 hover:text-teal-200"
                >
                  Contoh Backend
                </button>
              </div>
              <textarea
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Tempel deskripsi pekerjaan di sini..."
                className="w-full resize-none rounded-xl border border-slate-700 bg-[#090f1d]/80 p-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-teal-400/60"
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-300 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(45,212,191,0.18)] transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sedang menganalisis..." : "Analisis kecocokan CV"}{" "}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-rose-400/20 bg-rose-400/8 p-4 text-xs text-rose-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-300" />
              {errorMsg}
            </div>
          )}

          {result && (
            <div className="mt-8 rounded-2xl border border-teal-400/20 bg-[#0d1424]/90 p-5 shadow-2xl shadow-black/20 sm:p-7">
              <div className="flex flex-col justify-between gap-5 border-b border-white/8 pb-6 sm:flex-row sm:items-start">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                    Ringkasan analisis
                  </p>
                  <h2 className="text-xl font-semibold text-white">
                    Kesiapan CV Anda
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    {result.summary}
                  </p>
                </div>
                <div className="shrink-0 rounded-xl border border-teal-400/20 bg-teal-400/6 px-6 py-3 text-center">
                  <p className="text-[11px] text-slate-400">
                    Skor kecocokan ATS
                  </p>
                  <p
                    className={`mt-1 text-4xl font-bold ${result.score >= 80 ? "text-teal-300" : result.score >= 50 ? "text-amber-300" : "text-rose-300"}`}
                  >
                    {result.score}%
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {result.matched_skills.length} dari{" "}
                    {result.total_required_skills} kompetensi cocok
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-teal-400/15 bg-teal-400/4 p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-300">
                    <CheckCircle2 className="h-4 w-4" /> Kompetensi terdeteksi (
                    {result.matched_skills.length})
                  </h3>
                  {result.matched_skills.length ? (
                    <div className="flex flex-wrap gap-2">
                      {result.matched_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded-md border border-teal-400/20 bg-teal-400/8 px-2.5 py-1 text-xs text-teal-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Belum ada kompetensi yang cocok.
                    </p>
                  )}
                </div>
                <div className="rounded-xl border border-rose-400/15 bg-rose-400/4 p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-300">
                    <AlertTriangle className="h-4 w-4" /> Kompetensi yang perlu
                    ditambahkan ({result.missing_skills.length})
                  </h3>
                  {result.missing_skills.length ? (
                    <>
                      <div className="flex flex-wrap gap-2">
                        {result.missing_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-md border border-rose-400/20 bg-rose-400/8 px-2.5 py-1 text-xs text-rose-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="mt-4 text-xs leading-5 text-slate-400">
                        Pertimbangkan untuk menambahkan kompetensi ini pada
                        bagian keahlian atau pengalaman yang relevan.
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-teal-300">
                      CV Anda sudah mencakup seluruh kompetensi penting.
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-2 border-t border-white/8 pt-4 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {result.total_resume_words} kata berhasil dipindai dari CV
                </span>
                <span className="flex items-center gap-1 text-teal-300">
                  <Search className="h-3 w-3" /> Analisis keyword aktif
                </span>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
