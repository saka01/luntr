import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Deductly | Unlock Missed Tax Deductions for Freelancers & Sole Proprietors",
  description:
    "Deductly helps Canadian accountants and bookkeepers uncover missed T2125 tax deductions through intelligent automation and client self-review workflows — built in Canada for Canadians.",
  keywords: [
    "T2125 tax deductions",
    "Canadian accountants",
    "bookkeepers",
    "freelancer taxes",
    "self-employed tax Canada",
    "tax automation software",
    "accounting firms Canada",
    "CRA compliance",
    "deduction finder",
    "Deductly",
  ],
  openGraph: {
    title: "Deductly | Built in Canada for Accountants",
    description:
      "Uncover missed tax deductions for freelancers and sole proprietors with intelligent automation. Backed by CPAs. Built in Canada for Canadians.",
    url: "https://taxdeductly.ca",
    siteName: "Deductly",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deductly | Unlock Missed Tax Deductions",
    description: "Helping Canadian accountants find more for their clients — powered by intelligent tax automation.",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`} suppressHydrationWarning>
        <Header />
        {children}
      </body>
    </html>
  )
}
