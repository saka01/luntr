import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tallo | Canada Income Tax Calculator",
  description:
    "Calculate your income tax instantly. Get accurate estimates for federal tax, provincial tax, and see your total tax liability or refund.",
  keywords: [
    "income tax calculator",
    "Canadian tax calculator",
    "federal tax",
    "provincial tax",
    "tax refund calculator",
    "income tax Canada",
    "tax liability calculator",
    "Tallo",
  ],
  openGraph: {
    title: "Tallo | Canada Income Tax Calculator",
    description:
      "Calculate your income tax instantly. Get accurate estimates for federal tax, provincial tax, and see your total tax liability or refund.",
    url: "https://tallo.ca/canada-income-tax-calculator",
    siteName: "Tallo",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tallo | Canada Income Tax Calculator",
    description: "Calculate your income tax instantly. Get accurate estimates for federal tax, provincial tax, and see your total tax liability or refund.",
  },
}

const CanadaIncomeTaxCalculatorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background text-foreground">
      {children}
    </div>
  )
}

export default CanadaIncomeTaxCalculatorLayout