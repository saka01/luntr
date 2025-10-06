import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Step-by-Step Guide: Filling Out the T2125 Form (Line by Line) | Tallo",
  description: "Detailed walkthrough of completing the T2125 form with explanations for each line and common mistakes to avoid.",
  keywords: [
    "how to fill T2125 form",
    "T2125 form instructions",
    "T2125 line by line guide",
    "filling out T2125 Canada",
    "T2125 form completion",
    "self-employed tax form",
    "T2125 step by step",
    "Canadian T2125 guide",
    "T2125 form help",
    "freelancer tax form",
  ],
  openGraph: {
    title: "Step-by-Step Guide: Filling Out the T2125 Form (Line by Line)",
    description: "Detailed walkthrough of completing the T2125 form with explanations for each line and common mistakes to avoid.",
    type: "article",
  },
}

export default function HowToFillT2125Form() {
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
            <span className="text-slate-900">How to Fill T2125 Form</span>
          </div>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm  rounded-full">
                Forms & Filing
              </span>
              <span className="text-sm text-slate-500">15 min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl  text-slate-900 mb-6">
              Step-by-Step Guide: Filling Out the T2125 Form (Line by Line)
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Detailed walkthrough of completing the T2125 Statement of Business or Professional Activities form, 
              with explanations for each line and common mistakes to avoid.
            </p>
          </header>

          {/* Table of Contents */}
          <div className="bg-white rounded-xl p-6 mb-12 shadow-sm border border-slate-200">
            <h2 className="text-xl  text-slate-900 mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#before-you-start" className="hover:text-blue-600">Before You Start</a></li>
              <li><a href="#part-1-identification" className="hover:text-blue-600">Part 1: Identification</a></li>
              <li><a href="#part-2-income" className="hover:text-blue-600">Part 2: Income</a></li>
              <li><a href="#part-3-expenses" className="hover:text-blue-600">Part 3: Expenses</a></li>
              <li><a href="#part-4-net-income" className="hover:text-blue-600">Part 4: Net Income</a></li>
              <li><a href="#common-mistakes" className="hover:text-blue-600">Common Mistakes to Avoid</a></li>
              <li><a href="#tips" className="hover:text-blue-600">Tips for Success</a></li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <section id="before-you-start" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Before You Start</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Before filling out the T2125 form, gather all necessary information and documents:
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">Required Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Business Information</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Business name and address</li>
                        <li>• Business type and activities</li>
                        <li>• Fiscal period (usually Jan 1 - Dec 31)</li>
                        <li>• Business start date</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Financial Records</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• All business income records</li>
                        <li>• All business expense receipts</li>
                        <li>• Bank statements</li>
                        <li>• Invoices and payment records</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                <h3 className="text-lg  text-blue-900 mb-2">Pro Tip:</h3>
                <p className="text-blue-800 text-sm">
                  Use accounting software or a spreadsheet to organize your income and expenses before filling out the form. 
                  This will make the process much easier and reduce errors.
                </p>
              </div>
            </section>

            <section id="part-1-identification" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Part 1: Identification</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                This section identifies your business and provides basic information:
              </p>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Line 1: Business Name</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Enter your business name. If you don't have a registered business name, use "Sole Proprietorship" or your personal name.
                  </p>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className=" mb-2">Examples:</p>
                    <p>• "John Smith Consulting"</p>
                    <p>• "Sole Proprietorship"</p>
                    <p>• "Jane Doe Photography"</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Line 2: Business Type</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Select the type of business that best describes your activities from the dropdown menu.
                  </p>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className=" mb-2">Common Options:</p>
                    <p>• Professional services</p>
                    <p>• Consulting services</p>
                    <p>• Creative services</p>
                    <p>• Technical services</p>
                    <p>• Other (specify)</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Line 3: Fiscal Period</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Enter your business fiscal period. For most sole proprietors, this is January 1 to December 31.
                  </p>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className=" mb-2">Format:</p>
                    <p>From: 2024-01-01 To: 2024-12-31</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Line 4: Business Address</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Enter your business address. This can be your home address if you work from home.
                  </p>
                </div>
              </div>
            </section>

            <section id="part-2-income" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Part 2: Income</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                This section reports your gross business income from all sources:
              </p>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Line 1: Gross Business Income</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Enter your total gross business income before any expenses. Include all revenue from clients, customers, and other sources.
                  </p>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className=" mb-2">Include:</p>
                    <p>• Client payments</p>
                    <p>• Service fees</p>
                    <p>• Product sales</p>
                    <p>• Consulting fees</p>
                    <p>• Any other business revenue</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Line 2: Other Business Income</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Enter any other business income not included in line 1, such as interest on business accounts or other business-related income.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Line 3: Total Business Income</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Add lines 1 and 2 to get your total business income. This is the amount that will be subject to income tax and CPP contributions.
                  </p>
                </div>
              </div>
            </section>

            <section id="part-3-expenses" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Part 3: Expenses</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                This section allows you to claim business expenses to reduce your taxable income:
              </p>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Common Expense Lines</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Office Expenses</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Office supplies</li>
                        <li>• Computer equipment</li>
                        <li>• Software licenses</li>
                        <li>• Internet and phone</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Business Expenses</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Professional development</li>
                        <li>• Marketing and advertising</li>
                        <li>• Vehicle expenses</li>
                        <li>• Home office expenses</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Line-by-Line Guide</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Line 1: Office Supplies</h4>
                      <p className="text-slate-600 text-sm">Enter the cost of office supplies, paper, pens, etc.</p>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Line 2: Professional Fees</h4>
                      <p className="text-slate-600 text-sm">Enter legal, accounting, and other professional service fees.</p>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Line 3: Insurance</h4>
                      <p className="text-slate-600 text-sm">Enter business insurance premiums.</p>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Line 4: Interest and Bank Charges</h4>
                      <p className="text-slate-600 text-sm">Enter interest on business loans and bank fees.</p>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Line 5: Meals and Entertainment</h4>
                      <p className="text-slate-600 text-sm">Enter 50% of business meals and entertainment expenses.</p>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Line 6: Office Rent</h4>
                      <p className="text-slate-600 text-sm">Enter office rent (if not home office).</p>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Line 7: Repairs and Maintenance</h4>
                      <p className="text-slate-600 text-sm">Enter repairs and maintenance costs for business equipment.</p>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Line 8: Supplies</h4>
                      <p className="text-slate-600 text-sm">Enter other business supplies not included elsewhere.</p>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Line 9: Telephone and Utilities</h4>
                      <p className="text-slate-600 text-sm">Enter business portion of phone and utility bills.</p>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Line 10: Travel</h4>
                      <p className="text-slate-600 text-sm">Enter business travel expenses (excluding meals).</p>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Line 11: Motor Vehicle Expenses</h4>
                      <p className="text-slate-600 text-sm">Enter business portion of vehicle expenses.</p>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Line 12: Other Expenses</h4>
                      <p className="text-slate-600 text-sm">Enter any other business expenses not listed above.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Total Expenses</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Add all expense lines to get your total business expenses. This amount will be subtracted from your gross income.
                  </p>
                </div>
              </div>
            </section>

            <section id="part-4-net-income" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Part 4: Net Income</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                This section calculates your net business income and CPP contributions:
              </p>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Line 1: Net Business Income</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Subtract total expenses from total income to get your net business income.
                  </p>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className=" mb-2">Calculation:</p>
                    <p>Net Business Income = Total Income - Total Expenses</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Line 2: CPP Contributions</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Calculate your CPP contributions based on your net business income.
                  </p>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className=" mb-2">Calculation:</p>
                    <p>CPP = (Net Business Income - $3,500) × 9.9%</p>
                    <p className="text-slate-500 text-xs mt-2">Maximum CPP for 2024: $3,867.50</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Line 3: Final Net Income</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Subtract CPP contributions from net business income to get your final net income.
                  </p>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className=" mb-2">Calculation:</p>
                    <p>Final Net Income = Net Business Income - CPP Contributions</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="common-mistakes" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Common Mistakes to Avoid</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 border-l-4 border-red-400 p-6">
                  <h3 className="text-lg  text-red-900 mb-3">❌ Common Mistakes</h3>
                  <ul className="space-y-2 text-red-800 text-sm">
                    <li>• Not including all business income</li>
                    <li>• Claiming personal expenses as business</li>
                    <li>• Incorrectly calculating home office percentage</li>
                    <li>• Not keeping proper receipts</li>
                    <li>• Mixing up gross and net income</li>
                    <li>• Incorrectly calculating CPP contributions</li>
                    <li>• Not double-checking calculations</li>
                  </ul>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-6">
                  <h3 className="text-lg  text-green-900 mb-3">✅ Best Practices</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Keep detailed records throughout the year</li>
                    <li>• Double-check all calculations</li>
                    <li>• Use accounting software</li>
                    <li>• Keep receipts and documentation</li>
                    <li>• Review the form before submitting</li>
                    <li>• Consider hiring an accountant</li>
                    <li>• Stay updated on tax law changes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="tips" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Tips for Success</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg  text-blue-900 mb-4">💡 Filling Tips</h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>• Read the form instructions carefully</li>
                    <li>• Use a calculator for all math</li>
                    <li>• Fill out the form in pencil first</li>
                    <li>• Double-check all numbers</li>
                    <li>• Keep a copy for your records</li>
                    <li>• Don't leave any required fields blank</li>
                    <li>• Use the same numbers throughout</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg  text-green-900 mb-4">📊 Organization Tips</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Organize receipts by category</li>
                    <li>• Use a spreadsheet for calculations</li>
                    <li>• Keep business and personal separate</li>
                    <li>• Review your records monthly</li>
                    <li>• Plan for next year's taxes</li>
                    <li>• Consider using tax software</li>
                    <li>• Consult professionals when needed</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-2xl  text-slate-900 mb-4 text-center">Need Help with Your T2125?</h3>
              <p className="text-slate-600 text-center mb-6">
                Use our free T2125 calculator to get an instant estimate and make filling out the form easier.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/canada-t2125-tax-calculator"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg  hover:bg-blue-700 transition-colors text-center"
                >
                  T2125 Calculator
                </Link>
                <Link
                  href="/guides"
                  className="bg-slate-100 text-slate-700 px-8 py-3 rounded-lg  hover:bg-slate-200 transition-colors text-center"
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
