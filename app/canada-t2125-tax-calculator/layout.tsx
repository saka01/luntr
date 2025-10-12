import { Metadata } from "next";
import "../globals.css"

export const metadata: Metadata = {
    title: "Tallo | T2125 Tax Calculator for Canadian creators",
    description:
      "Calculate your self-employment taxes instantly. Get accurate estimates for federal tax, provincial tax, and CPP contributions with our comprehensive calculator.",
    keywords: [
      "T2125 tax deductions",
      "Canadian creators",
      "bookkeepers",
      "creator taxes",
      "self-employed tax Canada",
      "tax automation software",
      "creators firms Canada",
      "CRA compliance",
      "deduction finder",
      "Tallo",
    ],
    openGraph: {
      title: "Tallo | T2125 Tax Calculator for Canadian creators",
      description:
        "Calculate your self-employment taxes instantly. Get accurate estimates for federal tax, provincial tax, and CPP contributions with our comprehensive calculator.",
      url: "https://tallo.ca/canada-t2125-tax-calculator",
      siteName: "Tallo",
      locale: "en_CA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Tallo | T2125 Tax Calculator for Canadian creators",
      description: "Calculate your self-employment taxes instantly. Get accurate estimates for federal tax, provincial tax, and CPP contributions with our comprehensive calculator.",
    },
  }

const T2125TaxCalculatorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background text-foreground">
      {children}
    </div>
  )
}

export default T2125TaxCalculatorLayout;

