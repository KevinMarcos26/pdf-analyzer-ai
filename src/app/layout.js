import "./globals.css";

export const metadata = {
  title: "PDF Analyzer AI - Analiza tus documentos con IA",
  description: "Sube archivos PDF y obtén un análisis inteligente impulsado por IA. Resúmenes, puntos clave y más.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
