import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import AppThemeProvider from "@/components/AppThemeProvider";
import BottomMobileNavigation from "@/components/BottomMobileNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "RepoLens",
  title: {
    default: "RepoLens",
    template: "%s | RepoLens",
  },
  description: "Analyze repositories, compare quality signals, and export recruiter-ready reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AppThemeProvider>
          <AuthProvider>
            <Navbar />
            {children}
            <BottomMobileNavigation />
          </AuthProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
