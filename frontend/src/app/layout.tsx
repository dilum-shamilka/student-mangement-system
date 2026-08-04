import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
// @ts-ignore
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Student Management System",
    description: "Student Management System built with Next.js and Spring Boot",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${outfit.variable} min-h-screen bg-slate-50/50 gradient-bg text-slate-900 antialiased`}
            suppressHydrationWarning
        >
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}