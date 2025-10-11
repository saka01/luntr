import type React from "react"
import type { Metadata } from "next"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Tallo | Firms that use Tallo",
  description:
    "Tallo helps Canadian accountants and bookkeepers uncover missed T2125 tax deductions through intelligent automation and client self-review workflows — built in Canada for Canadians.",
  keywords: [
    "Firms that use Tallo",
    "Canadian accountants",
    "bookkeepers",
    "freelancer taxes",
    "self-employed tax Canada",
    "tax automation software",
    "accounting firms Canada",
    "CRA compliance",
    "deduction finder",
    "Tallo",
  ],
  openGraph: {
    title: "Tallo | Built in Canada for Accountants",
    description:
      "Uncover missed tax deductions for freelancers and sole proprietors with intelligent automation. Backed by CPAs. Built in Canada for Canadians.",
    url: "https://tallo.ca/firms",
    siteName: "Tallo",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tallo | Unlock Missed Tax Deductions",
    description: "Helping Canadian accountants find more for their clients — powered by intelligent tax automation. Built in Canada for Canadians.",
  },
}

export default function FirmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
