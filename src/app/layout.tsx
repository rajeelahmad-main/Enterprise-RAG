import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sukkur IBA University | HR Intelligence Assistant',
  description: 'Sukkur IBA University (SIBAU) Employee Handbook 2018 Policy Assistant powered by Gemini RAG',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
