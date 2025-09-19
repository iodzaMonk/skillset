import { ThemeModeScript } from "flowbite-react";
import type { Metadata } from "next";
import { ThemeInit } from "../.flowbite-react/init";
import "./globals.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import AuthProvider from "./context/AuthProvider";

export const metadata: Metadata = {
  title: "SkillSet",
  description: "Sell your skills for money",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <ThemeModeScript />
      </head>
      <body className="bg-canvas text-text !font-Faustina flex min-h-dvh flex-col antialiased">
        <ThemeInit />

        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
