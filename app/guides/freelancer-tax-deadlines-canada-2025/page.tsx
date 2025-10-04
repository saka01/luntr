import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Canadian Freelancer Tax Deadlines and Filing Checklist (2025) | Tallo",
  description: "Important tax deadlines and comprehensive checklist for Canadian freelancers in 2025. Stay compliant and organized with our tax planning guide.",
  keywords: [
    "freelancer tax deadlines Canada 2025",
    "Canadian tax deadlines 2025",
    "self-employed tax deadlines",
    "T2125 filing deadlines",
    "freelancer tax checklist",
    "Canadian tax planning 2025",
    "self-employed tax planning",
    "freelancer tax compliance",
    "Canadian tax deadlines",
    "freelancer tax calendar",
  ],
  openGraph: {
    title: "Canadian Freelancer Tax Deadlines and Filing Checklist (2025)",
    description: "Important tax deadlines and comprehensive checklist for Canadian freelancers in 2025. Stay compliant and organized with our tax planning guide.",
    type: "article",
  },
}

export default function FreelancerTaxDeadlines2025() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-blue-600">Guides</Link>
            <span>/</span>
            <span className="text-slate-900">Tax Deadlines 2025</span>
          </div>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                Deadlines & Planning
              </span>
              <span className="text-sm text-slate-500">5 min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Canadian Freelancer Tax Deadlines and Filing Checklist (2025)
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Important tax deadlines and a comprehensive checklist to help Canadian freelancers stay compliant 
              and organized throughout 2025.
            </p>
          </header>

          {/* Table of Contents */}
          <div className="bg-white rounded-xl p-6 mb-12 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#key-deadlines" className="hover:text-blue-600">Key Tax Deadlines for 2025</a></li>
              <li><a href="#quarterly-installments" className="hover:text-blue-600">Quarterly Tax Installments</a></li>
              <li><a href="#gst-hst-deadlines" className="hover:text-blue-600">GST/HST Filing Deadlines</a></li>
              <li><a href="#monthly-checklist" className="hover:text-blue-600">Monthly Tax Checklist</a></li>
              <li><a href="#quarterly-checklist" className="hover:text-blue-600">Quarterly Tax Checklist</a></li>
              <li><a href="#annual-checklist" className="hover:text-blue-600">Annual Tax Checklist</a></li>
              <li><a href="#penalties" className="hover:text-blue-600">Penalties and Interest</a></li>
              <li><a href="#tips" className="hover:text-blue-600">Tips for Staying Organized</a></li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <section id="key-deadlines" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Key Tax Deadlines for 2025</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Here are the most important tax deadlines for Canadian freelancers in 2025:
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">2025 Tax Deadlines</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-red-900">April 30, 2025</h4>
                        <p className="text-red-800 text-sm">Personal Tax Return (T1) - If you have employment income</p>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">Critical</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-orange-900">June 15, 2025</h4>
                        <p className="text-orange-800 text-sm">Self-Employment Tax Return (T1 + T2125) - If self-employed only</p>
                      </div>
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded">Important</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-blue-900">March 31, 2025</h4>
                        <p className="text-blue-800 text-sm">RRSP Contribution Deadline for 2024</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">Planning</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Note:</h3>
                <p className="text-yellow-800 text-sm">
                  If you have both employment and self-employment income, you must file by April 30, 2025. 
                  The June 15 deadline only applies if you have self-employment income only.
                </p>
              </div>
            </section>

            <section id="quarterly-installments" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Quarterly Tax Installments</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                If you expect to owe more than $3,000 in taxes, you may need to make quarterly installments:
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">2025 Quarterly Installment Deadlines</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Installment Dates</h4>
                      <ul className="space-y-2 text-slate-600 text-sm">
                        <li>• March 15, 2025 (Q1)</li>
                        <li>• June 15, 2025 (Q2)</li>
                        <li>• September 15, 2025 (Q3)</li>
                        <li>• December 15, 2025 (Q4)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Payment Methods</h4>
                      <ul className="space-y-2 text-slate-600 text-sm">
                        <li>• Online banking</li>
                        <li>• CRA My Payment</li>
                        <li>• Pre-authorized debit</li>
                        <li>• Credit card (fees apply)</li>
                        <li>• Cheque by mail</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Penalty for Late Installments:</h3>
                <p className="text-red-800 text-sm">
                  If you don't make required installments or pay them late, you'll be charged interest on the outstanding amount. 
                  The interest rate is typically around 6-8% annually, compounded daily.
                </p>
              </div>
            </section>

            <section id="gst-hst-deadlines" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">GST/HST Filing Deadlines</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                If you're registered for GST/HST, you must file returns regularly:
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">GST/HST Filing Deadlines</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Annual Returns</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Due: 3 months after year-end</li>
                        <li>• For revenue < $1.5M</li>
                        <li>• 2024 return due: March 31, 2025</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Quarterly Returns</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Due: 1 month after quarter-end</li>
                        <li>• For revenue $1.5M - $6M</li>
                        <li>• Q1 2025 due: April 30, 2025</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Monthly Returns</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Due: 1 month after month-end</li>
                        <li>• For revenue > $6M</li>
                        <li>• January 2025 due: February 28, 2025</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="monthly-checklist" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Monthly Tax Checklist</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Stay organized throughout the year with this monthly checklist:
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Tasks</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Income Tracking</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Record all business income</li>
                        <li>• Update client payment records</li>
                        <li>• Track outstanding invoices</li>
                        <li>• Reconcile bank statements</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Expense Tracking</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Record all business expenses</li>
                        <li>• Organize receipts and invoices</li>
                        <li>• Update mileage logs</li>
                        <li>• Track home office expenses</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="quarterly-checklist" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Quarterly Tax Checklist</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Every quarter, review your tax situation and make necessary payments:
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Quarterly Tasks</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Tax Planning</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Review income and expenses</li>
                        <li>• Calculate estimated tax liability</li>
                        <li>• Make quarterly installments if required</li>
                        <li>• Plan for year-end deductions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Record Keeping</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Organize quarterly receipts</li>
                        <li>• Update business records</li>
                        <li>• Review and adjust budgets</li>
                        <li>• Plan for next quarter</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="annual-checklist" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Annual Tax Checklist</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                At year-end, complete these tasks to prepare for tax filing:
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Year-End Tasks</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Documentation</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Gather all T4 slips</li>
                        <li>• Collect business expense receipts</li>
                        <li>• Organize bank statements</li>
                        <li>• Prepare T2125 form</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Tax Planning</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Maximize RRSP contributions</li>
                        <li>• Plan for next year's taxes</li>
                        <li>• Review business structure</li>
                        <li>• Consider tax strategies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="penalties" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Penalties and Interest</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Understanding the consequences of missing deadlines:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">❌ Late Filing Penalties</h3>
                  <ul className="space-y-2 text-red-800 text-sm">
                    <li>• 5% of balance owing + 1% per month</li>
                    <li>• Maximum penalty: 12 months</li>
                    <li>• Additional penalty for repeated late filing</li>
                    <li>• Interest on outstanding amounts</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">✅ Avoiding Penalties</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• File on time or request extension</li>
                    <li>• Pay estimated amounts by deadline</li>
                    <li>• Set up payment arrangements if needed</li>
                    <li>• Keep detailed records</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="tips" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Tips for Staying Organized</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Organization Tips</h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>• Use accounting software</li>
                    <li>• Set up automatic reminders</li>
                    <li>• Keep digital copies of receipts</li>
                    <li>• Use separate business accounts</li>
                    <li>• Review records monthly</li>
                    <li>• Plan for tax payments</li>
                    <li>• Consider hiring an accountant</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">📊 Planning Strategies</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Set aside 25-30% of income for taxes</li>
                    <li>• Make quarterly installments</li>
                    <li>• Plan major purchases strategically</li>
                    <li>• Review your tax situation regularly</li>
                    <li>• Consider incorporating</li>
                    <li>• Plan for retirement contributions</li>
                    <li>• Stay updated on tax law changes</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">Stay on Top of Your Taxes</h3>
              <p className="text-slate-600 text-center mb-6">
                Use our free calculators to estimate your tax obligations and stay organized throughout the year.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/canada-t2125-tax-calculator"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  T2125 Calculator
                </Link>
                <Link
                  href="/canada-income-tax-calculator"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                >
                  Income Tax Calculator
                </Link>
                <Link
                  href="/guides"
                  className="bg-slate-100 text-slate-700 px-8 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors text-center"
                >
                  Browse More Guides
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
