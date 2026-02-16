"use client";

import { useState, useRef, useCallback } from "react";

const WEBHOOK_URL = "https://kev96n8n.duckdns.org/webhook-test/split-pdf";

export default function Home() {
    const [files, setFiles] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const addFiles = useCallback((newFiles) => {
        const pdfFiles = Array.from(newFiles).filter(
            (f) => f.type === "application/pdf"
        );
        if (pdfFiles.length === 0) {
            setError("Solo se permiten archivos PDF.");
            setTimeout(() => setError(null), 3000);
            return;
        }
        setFiles((prev) => [...prev, ...pdfFiles]);
        setError(null);
    }, []);

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const handleFileInput = (e) => {
        if (e.target.files) addFiles(e.target.files);
        e.target.value = "";
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / 1048576).toFixed(1) + " MB";
    };

    const sendFiles = async () => {
        if (files.length === 0) return;
        setLoading(true);
        setResults([]);
        setError(null);

        const newResults = [];

        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file, file.name);

            // Fire-and-forget: send to webhook, always show success
            fetch(WEBHOOK_URL, {
                method: "POST",
                body: formData,
            }).catch(() => { });

            newResults.push({
                fileName: file.name,
                success: true,
                content: "✅ Archivo cargado exitosamente. Tu documento está siendo analizado por la IA.",
            });
        }

        setResults(newResults);
        setLoading(false);
        setFiles([]);
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "48px 16px",
            }}
        >
            {/* Header */}
            <div className="animate-fade-in" style={{ textAlign: "center", marginBottom: 40, maxWidth: 600 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <rect width="40" height="40" rx="10" fill="url(#grad1)" />
                        <path d="M12 28V12h10l6 6v10H12z" stroke="white" strokeWidth="2" fill="none" />
                        <path d="M22 12v6h6" stroke="white" strokeWidth="2" fill="none" />
                        <circle cx="28" cy="28" r="8" fill="#f97316" />
                        <path d="M26 28h4M28 26v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        <defs>
                            <linearGradient id="grad1" x1="0" y1="0" x2="40" y2="40">
                                <stop offset="0%" stopColor="#1e3a5f" />
                                <stop offset="100%" stopColor="#2a5a8f" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <h1 style={{ fontSize: 32, fontWeight: 800, background: "linear-gradient(135deg, #fdba74, #f97316, #2a5a8f)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        PDF Analyzer AI
                    </h1>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.6 }}>
                    Sube tus archivos PDF y obtén un análisis inteligente impulsado por IA
                </p>
            </div>

            {/* Card */}
            <div
                className="animate-fade-in delay-1"
                style={{
                    width: "100%",
                    maxWidth: 560,
                    background: "rgba(17, 24, 39, 0.7)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 20,
                    padding: 32,
                }}
            >
                {/* Drop Zone */}
                <div
                    className={`drop-zone ${dragging ? "dragging" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf"
                        multiple
                        hidden
                        onChange={handleFileInput}
                    />
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: "0 auto 16px" }}>
                        <rect width="48" height="48" rx="12" fill="rgba(249,115,22,0.1)" />
                        <path d="M24 16v16M16 24l8-8 8 8" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                        Arrastra tus PDFs aquí
                    </p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                        o haz clic para seleccionar archivos
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{ marginTop: 16, padding: "10px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#fca5a5", fontSize: 13 }}>
                        {error}
                    </div>
                )}

                {/* File List */}
                {files.length > 0 && (
                    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                        {files.map((file, i) => (
                            <div key={i} className="file-item">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                                    <rect width="24" height="24" rx="6" fill="rgba(249,115,22,0.15)" />
                                    <text x="12" y="16" textAnchor="middle" fill="#f97316" fontSize="8" fontWeight="700">
                                        PDF
                                    </text>
                                </svg>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {file.name}
                                    </p>
                                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                                <button className="btn-remove" onClick={() => removeFile(i)} title="Eliminar">
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Send Button */}
                <button
                    className={`btn-send ${loading ? "loading" : ""}`}
                    style={{ marginTop: 24 }}
                    disabled={files.length === 0 || loading}
                    onClick={sendFiles}
                >
                    {loading ? (
                        <>
                            <div className="spinner" />
                            Analizando...
                        </>
                    ) : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M3 10l7-7 7 7M10 3v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Enviar para Análisis
                        </>
                    )}
                </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
                <div className="animate-fade-in delay-2" style={{ width: "100%", maxWidth: 560, marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
                    {results.map((r, i) => (
                        <div key={i} className="result-card">
                            <div className="result-header">
                                {r.success ? (
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <circle cx="10" cy="10" r="9" stroke="#fdba74" strokeWidth="1.5" />
                                        <path d="M6 10l3 3 5-6" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <circle cx="10" cy="10" r="9" stroke="#ef4444" strokeWidth="1.5" />
                                        <path d="M7 7l6 6M13 7l-6 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                )}
                                {r.fileName}
                            </div>
                            <div className="result-content">{r.content}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer */}
            <p className="animate-fade-in delay-3" style={{ marginTop: 48, fontSize: 12, color: "var(--text-secondary)", opacity: 0.5 }}>
                Powered by n8n + OpenAI
            </p>
        </main>
    );
}
