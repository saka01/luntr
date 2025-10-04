import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "How to Calculate Your Home Office Deduction in Canada (T2125) | Tallo",
  description: "Complete guide to calculating and claiming home office expenses on T2125 form. Learn the rules, methods, and maximize your deductions legally.",
  keywords: [
    "home office deduction Canada",
    "T2125 home office expenses",
    "home office calculation Canada",
    "freelancer home office deduction",
    "self-employed home office",
    "CRA home office rules",
    "home office percentage calculation",
    "Canadian home office deduction",
    "T2125 home office expenses",
    "freelancer home office tax",
  ],
  openGraph: {
    title: "How to Calculate Your Home Office Deduction in Canada (T2125)",
    description: "Complete guide to calculating and claiming home office expenses on T2125 form. Learn the rules, methods, and maximize your deductions legally.",
    type: "article",
  },
}

export default function HomeOfficeDeduction() {
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
            <span className="text-slate-900">Home Office Deduction</span>
          </div>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Deductions
              </span>
              <span className="text-sm text-slate-500">9 min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              How to Calculate Your Home Office Deduction in Canada (T2125)
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Step-by-step guide to calculating and claiming your home office expenses on the T2125 form. 
              Learn the rules, methods, and maximize your deductions legally.
            </p>
          </header>

          {/* Table of Contents */}
          <div className="bg-white rounded-xl p-6 mb-12 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#qualification" className="hover:text-blue-600">Who Qualifies for Home Office Deduction</a></li>
              <li><a href="#expense-types" className="hover:text-blue-600">Types of Home Office Expenses</a></li>
              <li><a href="#calculation-methods" className="hover:text-blue-600">Calculation Methods</a></li>
              <li><a href="#percentage-calculation" className="hover:text-blue-600">How to Calculate Business Percentage</a></li>
              <li><a href="#examples" className="hover:text-blue-600">Real-World Examples</a></li>
              <li><a href="#common-mistakes" className="hover:text-blue-600">Common Mistakes to Avoid</a></li>
              <li><a href="#record-keeping" className="hover:text-blue-600">Record Keeping Requirements</a></li>
              <li><a href="#tips" className="hover:text-blue-600">Tips for Maximizing Deductions</a></li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <section id="qualification" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Who Qualifies for Home Office Deduction</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                To claim home office expenses on your T2125, you must meet specific CRA requirements:
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">CRA Requirements:</h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• You must work from home regularly</li>
                  <li>• Your home office must be your principal place of business</li>
                  <li>• The space must be used exclusively for business purposes</li>
                  <li>• You must meet clients/customers at home, OR</li>
                  <li>• You must use the space exclusively for business activities</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Note:</h3>
                <p className="text-yellow-800 text-sm">
                  The space doesn't need to be a separate room, but it must be clearly defined as your work area 
                  and used exclusively for business purposes during work hours.
                </p>
              </div>
            </section>

            <section id="expense-types" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Types of Home Office Expenses</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Direct Expenses (100% deductible)</h3>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Home office furniture and equipment</li>
                    <li>• Business phone line</li>
                    <li>• Internet service (business portion)</li>
                    <li>• Office repairs and maintenance</li>
                    <li>• Business insurance for home office</li>
                    <li>• Office supplies and materials</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Indirect Expenses (percentage deductible)</h3>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Rent or mortgage interest</li>
                    <li>• Property taxes</li>
                    <li>• Home insurance</li>
                    <li>• Utilities (heat, electricity, water)</li>
                    <li>• Home maintenance and repairs</li>
                    <li>• Condo fees (if applicable)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="calculation-methods" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Calculation Methods</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                There are two main methods to calculate your home office deduction:
              </p>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Method 1: Square Footage Method</h3>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className="font-semibold mb-2">Formula:</p>
                    <p className="text-slate-700">Business Percentage = (Home Office Area ÷ Total Home Area) × 100</p>
                    <p className="text-slate-700 mt-2">Deduction = Total Indirect Expenses × Business Percentage</p>
                  </div>
                  <p className="text-slate-600 text-sm mt-3">
                    This is the most common and straightforward method. Measure your home office area and divide by your total home area.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Method 2: Room Count Method</h3>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className="font-semibold mb-2">Formula:</p>
                    <p className="text-slate-700">Business Percentage = (Number of Business Rooms ÷ Total Rooms) × 100</p>
                    <p className="text-slate-700 mt-2">Deduction = Total Indirect Expenses × Business Percentage</p>
                  </div>
                  <p className="text-slate-600 text-sm mt-3">
                    Count the number of rooms used for business and divide by total rooms. Only use if rooms are similar in size.
                  </p>
                </div>
              </div>
            </section>

            <section id="percentage-calculation" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">How to Calculate Business Percentage</h2>
              
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Step-by-Step Calculation</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Step 1: Measure Your Home Office</h4>
                      <p className="text-slate-600 text-sm">Measure the length and width of your home office area in feet or meters.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Step 2: Calculate Office Area</h4>
                      <p className="text-slate-600 text-sm">Multiply length × width to get the square footage of your home office.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Step 3: Measure Total Home Area</h4>
                      <p className="text-slate-600 text-sm">Measure your entire home's square footage (excluding garage, unfinished basement, etc.).</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Step 4: Calculate Percentage</h4>
                      <p className="text-slate-600 text-sm">Divide home office area by total home area and multiply by 100.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Example Calculation:</h3>
                <p className="text-green-800 text-sm mb-3">
                  <strong>Sarah's home office: 10 ft × 12 ft = 120 sq ft</strong><br/>
                  <strong>Total home: 1,200 sq ft</strong>
                </p>
                <div className="bg-white p-4 rounded text-sm">
                  <p>• Home office area: 120 sq ft</p>
                  <p>• Total home area: 1,200 sq ft</p>
                  <p>• Business percentage: (120 ÷ 1,200) × 100 = 10%</p>
                  <p className="mt-2 font-semibold">Sarah can deduct 10% of her indirect home expenses</p>
                </div>
              </div>
            </section>

            <section id="examples" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Real-World Examples</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Example 1: Freelance Writer</h3>
                  <p className="text-slate-600 mb-3">
                    <strong>Mike uses a 8×10 ft corner of his living room as his office (10% of home)</strong>
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Direct Expenses (100% deductible):</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• Office desk and chair: $800</p>
                        <p>• Computer and monitor: $2,000</p>
                        <p>• Business phone line: $600</p>
                        <p>• Office supplies: $300</p>
                        <p className="font-semibold">Total direct: $3,700</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Indirect Expenses (10% deductible):</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• Rent: $24,000 × 10% = $2,400</p>
                        <p>• Utilities: $3,600 × 10% = $360</p>
                        <p>• Internet: $1,200 × 100% = $1,200</p>
                        <p>• Home insurance: $1,200 × 10% = $120</p>
                        <p className="font-semibold">Total indirect: $4,080</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-slate-50 rounded">
                    <p className="font-semibold text-slate-900">Total home office deduction: $7,780</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Example 2: Graphic Designer</h3>
                  <p className="text-slate-600 mb-3">
                    <strong>Lisa has a dedicated 12×12 ft home office (15% of home)</strong>
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Direct Expenses (100% deductible):</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• Professional desk setup: $1,500</p>
                        <p>• High-end computer: $3,000</p>
                        <p>• Design software: $1,200</p>
                        <p>• Office supplies: $500</p>
                        <p className="font-semibold">Total direct: $6,200</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Indirect Expenses (15% deductible):</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• Mortgage interest: $15,000 × 15% = $2,250</p>
                        <p>• Property taxes: $4,000 × 15% = $600</p>
                        <p>• Utilities: $4,800 × 15% = $720</p>
                        <p>• Home insurance: $1,500 × 15% = $225</p>
                        <p className="font-semibold">Total indirect: $3,795</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-slate-50 rounded">
                    <p className="font-semibold text-slate-900">Total home office deduction: $9,995</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="common-mistakes" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Common Mistakes to Avoid</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 border-l-4 border-red-400 p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">❌ Common Mistakes</h3>
                  <ul className="space-y-2 text-red-800 text-sm">
                    <li>• Claiming 100% of all home expenses</li>
                    <li>• Not keeping proper documentation</li>
                    <li>• Including personal use areas</li>
                    <li>• Not calculating percentage accurately</li>
                    <li>• Claiming expenses for non-business use</li>
                    <li>• Not meeting CRA requirements</li>
                  </ul>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">✅ Best Practices</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Calculate percentage accurately</li>
                    <li>• Keep detailed records and photos</li>
                    <li>• Separate business and personal use</li>
                    <li>• Document your work schedule</li>
                    <li>• Meet all CRA requirements</li>
                    <li>• Consult a tax professional if unsure</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="record-keeping" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Record Keeping Requirements</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                The CRA requires detailed documentation to support your home office deduction claims:
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Required Documentation:</h3>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li>• Photos of your home office setup</li>
                    <li>• Floor plan or measurements of your home</li>
                    <li>• Receipts for all direct expenses</li>
                    <li>• Utility bills and rent/mortgage statements</li>
                    <li>• Documentation of business use (client meetings, work schedule)</li>
                    <li>• Calculation worksheet showing your percentage</li>
                    <li>• Keep records for 6 years</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="tips" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Tips for Maximizing Deductions</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Maximization Tips</h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>• Use the square footage method for accuracy</li>
                    <li>• Claim 100% of direct business expenses</li>
                    <li>• Keep detailed records throughout the year</li>
                    <li>• Take photos of your office setup</li>
                    <li>• Document your work schedule</li>
                    <li>• Consider upgrading your office space</li>
                    <li>• Track all business-related home improvements</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">📊 Planning Strategies</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Plan major home improvements strategically</li>
                    <li>• Consider the tax impact of home office setup</li>
                    <li>• Keep business and personal expenses separate</li>
                    <li>• Review your percentage calculation annually</li>
                    <li>• Consider the impact on capital gains</li>
                    <li>• Plan for potential CRA audits</li>
                    <li>• Consult professionals for complex situations</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">Calculate Your Home Office Deduction</h3>
              <p className="text-slate-600 text-center mb-6">
                Use our free T2125 calculator to estimate your home office deduction and overall tax situation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/canada-t2125-tax-calculator"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  T2125 Calculator
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
