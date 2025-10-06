import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Tax Guides for Canadian Freelancers | Tallo",
  description: "Comprehensive tax guides for Canadian freelancers and self-employed individuals. Learn about T2125 forms, deductions, and tax calculations.",
  keywords: [
    "Canadian freelancer tax guides",
    "T2125 form guide",
    "self-employed tax Canada",
    "freelancer deductions",
    "Canadian tax resources",
    "T2125 deductions list",
    "self-employment tax calculation",
    "CPP contributions Canada",
    "home office deduction",
    "vehicle expenses T2125",
    "GST HST freelancers",
    "tax deadlines Canada",
  ],
}

const guides = [
  {
    title: "The Complete Guide to T2125 for Canadian Freelancers",
    description: "Everything you need to know about the T2125 form, from understanding when to use it to maximizing your deductions.",
    slug: "t2125-form-canada-freelancers",
    category: "Forms & Filing",
    readTime: "12 min read",
    featured: true,
  },
  {
    title: "List of Common T2125 Deductions (With Examples)",
    description: "A comprehensive list of deductible expenses for Canadian freelancers, complete with real-world examples and CRA guidelines.",
    slug: "t2125-deductions-list-canada",
    category: "Deductions",
    readTime: "8 min read",
    featured: true,
  },
  {
    title: "How to Calculate Self-Employment Tax in Canada (Step-by-Step)",
    description: "Learn how to calculate your self-employment taxes including income tax, CPP contributions, and EI premiums.",
    slug: "self-employment-tax-calculation-canada",
    category: "Calculations",
    readTime: "10 min read",
    featured: false,
  },
  {
    title: "T2125 vs Regular Tax Return: What's the Difference?",
    description: "Understanding the key differences between filing as self-employed vs. employed, and when to use each approach.",
    slug: "t2125-vs-personal-tax-return-canada",
    category: "Forms & Filing",
    readTime: "6 min read",
    featured: false,
  },
  {
    title: "CPP Contributions for Self-Employed Canadians: Explained Simply",
    description: "Everything about Canada Pension Plan contributions for freelancers, including rates, calculations, and payment schedules.",
    slug: "cpp-contributions-self-employed-canada",
    category: "Contributions",
    readTime: "7 min read",
    featured: false,
  },
  {
    title: "How to Calculate Your Home Office Deduction in Canada (T2125)",
    description: "Step-by-step guide to calculating and claiming your home office expenses on the T2125 form.",
    slug: "home-office-deduction-canada-t2125",
    category: "Deductions",
    readTime: "9 min read",
    featured: false,
  },
  {
    title: "Vehicle Expenses and T2125: What You Can Deduct",
    description: "Complete guide to vehicle-related deductions for Canadian freelancers, including mileage rates and record-keeping requirements.",
    slug: "t2125-vehicle-expenses-canada",
    category: "Deductions",
    readTime: "8 min read",
    featured: false,
  },
  {
    title: "GST/HST for Freelancers: When to Register and How to Calculate",
    description: "Understanding GST/HST registration requirements and calculations for Canadian freelancers and self-employed individuals.",
    slug: "gst-hst-registration-freelancers-canada",
    category: "Tax Registration",
    readTime: "11 min read",
    featured: false,
  },
  {
    title: "Canadian Freelancer Tax Deadlines and Filing Checklist (2025)",
    description: "Important tax deadlines and a comprehensive checklist to help Canadian freelancers stay compliant and organized.",
    slug: "freelancer-tax-deadlines-canada-2025",
    category: "Deadlines & Planning",
    readTime: "5 min read",
    featured: false,
  },
  {
    title: "Step-by-Step Guide: Filling Out the T2125 Form (Line by Line)",
    description: "Detailed walkthrough of completing the T2125 form, with explanations for each line and common mistakes to avoid.",
    slug: "how-to-fill-t2125-form-canada",
    category: "Forms & Filing",
    readTime: "15 min read",
    featured: true,
  },
]

const categories = [
  "All",
  "Forms & Filing",
  "Deductions",
  "Calculations",
  "Contributions",
  "Tax Registration",
  "Deadlines & Planning",
]

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl  text-slate-900 mb-6">
            Tax Guides for Canadian Freelancers
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive, easy-to-understand guides to help Canadian freelancers and self-employed individuals navigate their tax obligations and maximize their deductions.
          </p>
        </div>

        {/* Featured Guides */}
        <div className="mb-16">
          <h2 className="text-2xl  text-slate-900 mb-8">Featured Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides
              .filter((guide) => guide.featured)
              .map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-300"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm  rounded-full">
                        {guide.category}
                      </span>
                      <span className="text-sm text-slate-500">{guide.readTime}</span>
                    </div>
                    <h3 className="text-xl  text-slate-900 group-hover:text-blue-600 transition-colors mb-3">
                      {guide.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{guide.description}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* All Guides */}
        <div>
          <h2 className="text-2xl  text-slate-900 mb-8">All Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs  rounded">
                      {guide.category}
                    </span>
                    <span className="text-xs text-slate-500">{guide.readTime}</span>
                  </div>
                  <h3 className="text-lg  text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{guide.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl  mb-4">Ready to Calculate Your Taxes?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Use our free T2125 calculator to get an instant estimate of your self-employment taxes and discover deductions you might be missing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/canada-t2125-tax-calculator"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg  hover:bg-blue-50 transition-colors"
            >
              Try T2125 Calculator
            </Link>
            <Link
              href="/canada-income-tax-calculator"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg  hover:bg-blue-800 transition-colors"
            >
              Income Tax Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
