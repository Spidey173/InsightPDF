import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InsightPDF — Professional RAG Document Q&A & Analytics",
  description:
    "High-performance RAG-powered document QA and analytics system. Upload multi-page PDFs, extract semantic insights, and conduct interactive Q&A grounded entirely in the uploaded document content.",
  keywords: [
    "InsightPDF",
    "PDF Analysis",
    "RAG Q&A",
    "AI Document Search",
    "PDF Reader",
    "Document Analytics",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Permanent+Marker&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0b0c10] text-[#f1f5f9] antialiased">
        {children}
      </body>
    </html>
  );
}

