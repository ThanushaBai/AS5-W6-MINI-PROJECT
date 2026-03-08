import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Event Platform",
  description: "Create, discover, and manage events in multiple languages.",
  applicationName: "Global Event Platform",
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
