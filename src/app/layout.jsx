import './globals.css'

import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/components/ThemeProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: "Ankur | Full Stack Developer & Problem Solver",
  description: "Portfolio of Ankur, a B.Tech CSE student at IIIT Kota specializing in high-performance web applications and algorithmic problem solving.",
  keywords: ["Ankur", "Full Stack Developer", "IIIT Kota", "Software Engineer", "Web Development", "React", "Next.js"],
  authors: [{ name: "Ankur" }],
}

export const viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head />
      <body className="antialiased selection:bg-primary/30">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
