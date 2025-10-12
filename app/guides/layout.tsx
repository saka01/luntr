import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tallo | Tax Deduction Finder for Canadian Creators",
  description:
    "Discover which tax deductions you qualify for. Answer a few questions to get personalized deduction recommendations and maximize your tax savings.",
  keywords: [
    "tax deduction finder",
    "Canadian tax deductions",
    "creator deductions",
    "self-employed deductions",
    "T2125 deductions",
    "tax savings calculator",
    "deduction finder Canada",
    "Tallo",
  ],
  openGraph: {
    title: "Tallo | Tax Deduction Finder for Canadian Creators",
    description:
      "Discover which tax deductions you qualify for. Answer a few questions to get personalized deduction recommendations and maximize your tax savings.",
    url: "https://tallo.ca/deduction-finder",
    siteName: "Tallo",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tallo | Tax Deduction Finder for Canadian Creators",
    description: "Discover which tax deductions you qualify for. Answer a few questions to get personalized deduction recommendations and maximize your tax savings.",
  },
}

const GuidesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background text-foreground">   
      {children}
    </div>
  )
}

export default GuidesLayout;