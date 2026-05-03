import './globals.css'

import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/components/ThemeProvider";
import JsonLd from "@/components/JsonLd";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  metadataBase: new URL('https://ankurdev.vercel.app'), // Replace with your production domain
  title: {
    default: "Ankur Singh | Web Developer & IIIT Kota Student",
    template: "%s | Ankur dev"
  },
  description: "Portfolio of Ankur Singh, a B.Tech CSE student at IIIT Kota. I am a frontend developer, UI/UX designer, and core developer at IIITians Network.",
  keywords: [
    "Ankur Singh IIIT Kota",
    "Ankur dev",
    "Ankur web developer",
    "IIIT Kota student Ankur",
    "IIITians Network developer",
    "frontend developer Ankur",
    "UI UX designer Ankur",
    "mobile developer Ankur",
    "Software Engineer",
    "React",
    "Next.js"
  ],
  authors: [{ name: "Ankur Singh", url: "https://ankurdev.vercel.app" }],
  creator: "Ankur Singh",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ankurdev.vercel.app",
    title: "Ankur Singh | Web Developer & IIIT Kota Student",
    description: "Portfolio of Ankur Singh, a frontend developer and student at IIIT Kota.",
    siteName: "Ankur dev",
    images: [{
      url: "/images/Ankur_Sem1_1.jpg",
      width: 1200,
      height: 630,
      alt: "Ankur Singh - IIIT Kota Student & Web Developer"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ankur Singh | Web Developer",
    description: "Frontend developer & IIIT Kota student specializing in React and Next.js.",
    creator: "@ankurrr27",
    images: ["/images/Ankur_Sem1_1.jpg"],
  },
  alternates: {
    canonical: "https://ankurdev.vercel.app",
  },
  verification: {
    google: "AXBGOdjkqT8jkXYEzNfCfZunxVAyDPfM5tBsY3Q4gc8",
  }
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
        <ThemeProvider suppressHydrationWarning>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
