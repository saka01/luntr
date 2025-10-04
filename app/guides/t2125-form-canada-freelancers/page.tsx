import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "The Complete Guide to T2125 for Canadian Freelancers | Tallo",
  description: "Everything you need to know about the T2125 form for Canadian freelancers. Learn when to use it, how to fill it out, and maximize your deductions.",
  keywords: [
    "T2125 form Canada",
    "Canadian freelancer taxes",
    "self-employed tax form",
    "T2125 guide",
    "freelancer tax Canada",
    "self-employment income",
    "T2125 deductions",
    "Canadian tax form",
    "freelancer tax return",
    "T2125 instructions",
  ],
  openGraph: {
    title: "The Complete Guide to T2125 for Canadian Freelancers",
    description: "Everything you need to know about the T2125 form for Canadian freelancers. Learn when to use it, how to fill it out, and maximize your deductions.",
    type: "article",
  },
}

export default function T2125CompleteGuide() {
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
            <span className="text-slate-900">T2125 Complete Guide</span>
          </div>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Forms & Filing
              </span>
              <span className="text-sm text-slate-500">12 min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              The Complete Guide to T2125 for Canadian Freelancers
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Everything you need to know about the T2125 Statement of Business or Professional Activities form, 
              from understanding when to use it to maximizing your deductions and staying compliant with CRA requirements.
            </p>
          </header>

          {/* Table of Contents */}
          <div className="bg-white rounded-xl p-6 mb-12 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#what-is-t2125" className="hover:text-blue-600">What is the T2125 Form?</a></li>
              <li><a href="#when-to-use" className="hover:text-blue-600">When Do You Need to File T2125?</a></li>
              <li><a href="#form-sections" className="hover:text-blue-600">Understanding T2125 Sections</a></li>
              <li><a href="#common-deductions" className="hover:text-blue-600">Common Deductions You Can Claim</a></li>
              <li><a href="#filling-out-form" className="hover:text-blue-600">Step-by-Step: Filling Out T2125</a></li>
              <li><a href="#common-mistakes" className="hover:text-blue-600">Common Mistakes to Avoid</a></li>
              <li><a href="#record-keeping" className="hover:text-blue-600">Record Keeping Requirements</a></li>
              <li><a href="#next-steps" className="hover:text-blue-600">Next Steps and Resources</a></li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <section id="what-is-t2125" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">What is the T2125 Form?</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                The T2125 Statement of Business or Professional Activities is a crucial tax form for Canadian freelancers, 
                contractors, and self-employed individuals. This form allows you to report your business income and claim 
                legitimate business expenses, ultimately reducing your taxable income and potentially saving you thousands 
                of dollars in taxes.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Key Points About T2125:</h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• Must be filed if you earned more than $1,000 in self-employment income</li>
                  <li>• Allows you to claim business expenses to reduce taxable income</li>
                  <li>• Required for CPP contributions on self-employment income</li>
                  <li>• Must be attached to your personal tax return (T1)</li>
                </ul>
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">
                Unlike employees who receive a T4 slip, freelancers must track their own income and expenses. 
                The T2125 form is your way of telling the CRA about your business activities and the costs 
                associated with earning that income.
              </p>
            </section>

            <section id="when-to-use" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">When Do You Need to File T2125?</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                You must file a T2125 form if you meet any of the following criteria:
              </p>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Filing Requirements:</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>Gross business income over $1,000:</strong> Even if your net income is negative, you must file if gross income exceeds $1,000</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>Claiming business expenses:</strong> If you want to deduct business expenses, you must file T2125</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>CPP contributions:</strong> Required for CPP contributions on self-employment income</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>GST/HST registration:</strong> If you're registered for GST/HST, you must file T2125</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Note:</h3>
                <p className="text-yellow-800">
                  Even if you had a loss in your business, you should still file T2125 if your gross income exceeded $1,000. 
                  Business losses can be used to offset other income or carried forward to future years.
                </p>
              </div>
            </section>

            <section id="form-sections" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Understanding T2125 Sections</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                The T2125 form is divided into several key sections. Understanding each section will help you 
                complete the form accurately and maximize your deductions.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Part 1: Identification</h3>
                  <p className="text-slate-600 text-sm">
                    Basic information about your business including name, type of business, and fiscal period.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Part 2: Income</h3>
                  <p className="text-slate-600 text-sm">
                    Report your gross business income from all sources including sales, fees, and other revenue.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Part 3: Expenses</h3>
                  <p className="text-slate-600 text-sm">
                    Claim all legitimate business expenses including office supplies, equipment, and professional fees.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Part 4: Net Income</h3>
                  <p className="text-slate-600 text-sm">
                    Calculate your net business income (gross income minus expenses) and CPP contributions.
                  </p>
                </div>
              </div>
            </section>

            <section id="common-deductions" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Common Deductions You Can Claim</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                One of the biggest advantages of being self-employed is the ability to deduct legitimate business expenses. 
                Here are the most common deductions Canadian freelancers can claim:
              </p>

              <div className="overflow-x-auto mb-8">
                <table className="w-full bg-white rounded-lg shadow-sm border border-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Expense Category</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Examples</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Office Supplies</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Paper, pens, software, computer equipment</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Must be used 100% for business</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Home Office</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Rent, utilities, internet, phone</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Calculate percentage of home used for business</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Professional Development</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Courses, conferences, books, training</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Must relate to your business</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Vehicle Expenses</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Gas, maintenance, insurance, depreciation</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Track business vs personal use</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Professional Services</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Legal fees, accounting, consulting</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Must be for business purposes</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Marketing & Advertising</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Website, business cards, online ads</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Must be for promoting your business</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Pro Tip:</h3>
                <p className="text-green-800">
                  Keep detailed records of all business expenses throughout the year. The CRA can request receipts 
                  and documentation for up to 6 years after you file your return.
                </p>
              </div>
            </section>

            <section id="filling-out-form" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Step-by-Step: Filling Out T2125</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Here's a detailed walkthrough of how to complete each section of the T2125 form:
              </p>

              <div className="space-y-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Step 1: Complete Part 1 - Identification</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Enter your business name (or "Sole Proprietorship" if you don't have a registered name)</li>
                    <li>• Select your business type from the dropdown menu</li>
                    <li>• Enter your fiscal period (usually January 1 to December 31)</li>
                    <li>• Provide your business address</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Step 2: Complete Part 2 - Income</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Enter your gross business income (before any expenses)</li>
                    <li>• Include all revenue from clients, customers, and other sources</li>
                    <li>• Don't subtract any expenses at this stage</li>
                    <li>• If you have multiple income sources, add them all together</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Step 3: Complete Part 3 - Expenses</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Enter each expense category in the appropriate line</li>
                    <li>• Be specific and accurate with amounts</li>
                    <li>• For home office expenses, calculate the business percentage</li>
                    <li>• For vehicle expenses, track business vs personal use</li>
                    <li>• Total all expenses at the bottom of the section</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Step 4: Complete Part 4 - Net Income</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Calculate net income (gross income minus total expenses)</li>
                    <li>• Calculate CPP contributions (9.9% of net income up to the maximum)</li>
                    <li>• Enter the final net business income amount</li>
                    <li>• This amount will be transferred to your T1 return</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="common-mistakes" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Common Mistakes to Avoid</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Avoid these common errors that can lead to CRA audits or missed deductions:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">❌ Common Mistakes</h3>
                  <ul className="space-y-2 text-red-800 text-sm">
                    <li>• Claiming personal expenses as business expenses</li>
                    <li>• Not keeping proper receipts and documentation</li>
                    <li>• Incorrectly calculating home office percentage</li>
                    <li>• Forgetting to include all income sources</li>
                    <li>• Not separating business and personal vehicle use</li>
                    <li>• Claiming expenses that aren't business-related</li>
                  </ul>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">✅ Best Practices</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Keep detailed records throughout the year</li>
                    <li>• Use separate bank accounts for business</li>
                    <li>• Take photos of receipts with your phone</li>
                    <li>• Calculate home office percentage accurately</li>
                    <li>• Track vehicle mileage for business trips</li>
                    <li>• Consult a tax professional for complex situations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="record-keeping" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Record Keeping Requirements</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                The CRA requires you to keep detailed records to support your T2125 claims. Here's what you need to maintain:
              </p>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Required Documentation:</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>Receipts and invoices:</strong> Keep all receipts for business expenses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>Bank statements:</strong> Maintain separate business bank account statements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>Income records:</strong> Track all client payments and income sources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>Vehicle logs:</strong> Record business trips with dates, destinations, and purposes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>Home office calculations:</strong> Document how you calculated the business percentage</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Retention Period:</h3>
                <p className="text-yellow-800">
                  Keep all business records for at least 6 years from the end of the tax year they relate to. 
                  The CRA can request these documents during an audit, and having them organized will save you time and stress.
                </p>
              </div>
            </section>

            <section id="next-steps" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Next Steps and Resources</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Now that you understand the T2125 form, here are your next steps and additional resources:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Immediate Actions</h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>• Start tracking your business expenses immediately</li>
                    <li>• Set up a separate business bank account</li>
                    <li>• Download expense tracking apps</li>
                    <li>• Organize your receipts and invoices</li>
                    <li>• Consider using accounting software</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Long-term Planning</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Plan for quarterly tax installments</li>
                    <li>• Consider incorporating your business</li>
                    <li>• Review your deductions annually</li>
                    <li>• Stay updated on tax law changes</li>
                    <li>• Build relationships with tax professionals</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">Ready to Calculate Your T2125?</h3>
                <p className="text-slate-600 text-center mb-6">
                  Use our free T2125 calculator to get an instant estimate of your self-employment taxes and discover deductions you might be missing.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/canada-t2125-tax-calculator"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                  >
                    Try T2125 Calculator
                  </Link>
                  <Link
                    href="/guides"
                    className="bg-slate-100 text-slate-700 px-8 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors text-center"
                  >
                    Browse More Guides
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  )
}
