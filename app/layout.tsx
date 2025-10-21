import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Luntr | Pattern Gym for Coding Practice",
  description:
    "Luntr helps developers master coding patterns through spaced repetition and AI-powered feedback. Build your coding fitness with structured practice sessions.",
  keywords: [
    "coding patterns",
    "algorithm practice",
    "coding interview prep",
    "spaced repetition",
    "coding fitness",
    "algorithm training",
    "coding patterns practice",
    "Luntr",
  ],
  openGraph: {
    title: "Luntr | Pattern Gym for Coding Practice",
    description:
      "Master coding patterns through structured practice sessions with AI-powered feedback and spaced repetition.",
    url: "https://luntr.dev",
    siteName: "Luntr",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luntr | Pattern Gym for Coding Practice",
    description: "Master coding patterns through structured practice sessions with AI-powered feedback and spaced repetition.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@3.4/dist/add-to-homescreen.min.css"
        />
        <script src="https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@3.4/dist/add-to-homescreen.min.js"></script>
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
