import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Vehicle Expenses and T2125: What You Can Deduct | Tallo",
  description: "Complete guide to vehicle expenses for Canadian freelancers on T2125. Learn about mileage rates, record keeping, and what you can deduct.",
  keywords: [
    "vehicle expenses T2125",
    "car deductions Canada",
    "freelancer vehicle expenses",
    "T2125 vehicle deductions",
    "mileage rates Canada",
    "vehicle expenses self-employed",
    "car expenses freelancer",
    "T2125 transportation",
    "vehicle deduction Canada",
    "freelancer car expenses",
  ],
  openGraph: {
    title: "Vehicle Expenses and T2125: What You Can Deduct",
    description: "Complete guide to vehicle expenses for Canadian freelancers on T2125. Learn about mileage rates, record keeping, and what you can deduct.",
    type: "article",
  },
}

export default function VehicleExpensesT2125() {
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
            <span className="text-slate-900">Vehicle Expenses T2125</span>
          </div>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm  rounded-full">
                Deductions
              </span>
              <span className="text-sm text-slate-500">8 min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl  text-slate-900 mb-6">
              Vehicle Expenses and T2125: What You Can Deduct
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Complete guide to vehicle-related deductions for Canadian freelancers, including mileage rates, 
              record-keeping requirements, and what you can legally deduct on your T2125 form.
            </p>
          </header>

          {/* Table of Contents */}
          <div className="bg-white rounded-xl p-6 mb-12 shadow-sm border border-slate-200">
            <h2 className="text-xl  text-slate-900 mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#overview" className="hover:text-blue-600">Vehicle Expense Overview</a></li>
              <li><a href="#deduction-methods" className="hover:text-blue-600">Two Deduction Methods</a></li>
              <li><a href="#detailed-method" className="hover:text-blue-600">Detailed Method (Actual Expenses)</a></li>
              <li><a href="#simplified-method" className="hover:text-blue-600">Simplified Method (Per KM Rate)</a></li>
              <li><a href="#record-keeping" className="hover:text-blue-600">Record Keeping Requirements</a></li>
              <li><a href="#examples" className="hover:text-blue-600">Real-World Examples</a></li>
              <li><a href="#common-mistakes" className="hover:text-blue-600">Common Mistakes to Avoid</a></li>
              <li><a href="#tips" className="hover:text-blue-600">Tips for Maximizing Deductions</a></li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <section id="overview" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Vehicle Expense Overview</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Vehicle expenses can be one of your largest deductions as a freelancer, but they require careful 
                tracking and calculation. The CRA allows you to deduct vehicle expenses related to your business activities.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <h3 className="text-lg  text-blue-900 mb-2">Key Points About Vehicle Expenses:</h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• You can only deduct the business portion of vehicle expenses</li>
                  <li>• Two methods available: detailed or simplified</li>
                  <li>• Detailed record keeping is required</li>
                  <li>• Personal use is not deductible</li>
                  <li>• You can choose the method that gives you the higher deduction</li>
                </ul>
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">
                The key is to track your business vs. personal use accurately and choose the deduction method 
                that gives you the highest legitimate deduction.
              </p>
            </section>

            <section id="deduction-methods" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Two Deduction Methods</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                The CRA offers two methods for calculating vehicle expenses. You can choose the one that gives you the higher deduction:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg  text-slate-900 mb-3">Method 1: Detailed Method</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Track all actual vehicle expenses and multiply by business use percentage.
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Track all vehicle expenses</li>
                    <li>• Calculate business use percentage</li>
                    <li>• Multiply total expenses by percentage</li>
                    <li>• Can claim depreciation and interest</li>
                    <li>• More complex but potentially higher deduction</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg  text-slate-900 mb-3">Method 2: Simplified Method</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Use a fixed rate per business kilometer driven.
                  </p>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Track business kilometers only</li>
                    <li>• Multiply by fixed rate per km</li>
                    <li>• 2024 rate: $0.70 per business km</li>
                    <li>• Cannot claim depreciation or interest</li>
                    <li>• Simpler but may be lower deduction</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="detailed-method" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Detailed Method (Actual Expenses)</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                The detailed method allows you to claim all actual vehicle expenses, but you must track business vs. personal use.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">Deductible Vehicle Expenses:</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Operating Expenses</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Gas and oil</li>
                        <li>• Insurance</li>
                        <li>• License and registration</li>
                        <li>• Maintenance and repairs</li>
                        <li>• Tires and parts</li>
                        <li>• Parking and tolls</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Capital Expenses</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Depreciation (Capital Cost Allowance)</li>
                        <li>• Interest on vehicle loan</li>
                        <li>• Lease payments (if leasing)</li>
                        <li>• Vehicle purchase price (depreciated)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6">
                <h3 className="text-lg  text-green-900 mb-2">Calculation Example:</h3>
                <p className="text-green-800 text-sm mb-3">
                  <strong>Sarah's vehicle expenses for 2024:</strong>
                </p>
                <div className="bg-white p-4 rounded text-sm">
                  <p className="mb-2"><strong>Total Vehicle Expenses:</strong></p>
                  <p>• Gas: $3,000</p>
                  <p>• Insurance: $1,200</p>
                  <p>• Maintenance: $800</p>
                  <p>• Depreciation: $2,000</p>
                  <p>• Interest: $600</p>
                  <p className="mt-2 ">Total: $7,600</p>
                  <p className="mt-2 mb-2"><strong>Business Use: 60%</strong></p>
                  <p className="">Deduction: $7,600 × 60% = $4,560</p>
                </div>
              </div>
            </section>

            <section id="simplified-method" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Simplified Method (Per KM Rate)</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                The simplified method uses a fixed rate per business kilometer, making it easier to calculate but potentially lower deductions.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">2024 Simplified Method Rates</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Rate per Business KM</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• 2024 rate: $0.70 per km</li>
                        <li>• Rate includes all operating costs</li>
                        <li>• No need to track actual expenses</li>
                        <li>• Cannot claim depreciation or interest</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">What's Included</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Gas and oil</li>
                        <li>• Insurance</li>
                        <li>• Maintenance and repairs</li>
                        <li>• License and registration</li>
                        <li>• Depreciation (limited)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                <h3 className="text-lg  text-blue-900 mb-2">Calculation Example:</h3>
                <p className="text-blue-800 text-sm mb-3">
                  <strong>Mike drove 5,000 business kilometers in 2024</strong>
                </p>
                <div className="bg-white p-4 rounded text-sm">
                  <p>• Business kilometers: 5,000</p>
                  <p>• Rate per km: $0.70</p>
                  <p className="">Deduction: 5,000 × $0.70 = $3,500</p>
                </div>
              </div>
            </section>

            <section id="record-keeping" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Record Keeping Requirements</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Proper record keeping is essential for vehicle expense deductions. The CRA can request these records during an audit.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">Required Documentation:</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">For Detailed Method</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Receipts for all vehicle expenses</li>
                        <li>• Mileage log with dates and purposes</li>
                        <li>• Vehicle purchase/lease documents</li>
                        <li>• Insurance and registration records</li>
                        <li>• Maintenance and repair receipts</li>
                        <li>• Business use percentage calculation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">For Simplified Method</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Detailed mileage log</li>
                        <li>• Dates of business trips</li>
                        <li>• Destinations and purposes</li>
                        <li>• Starting and ending odometer readings</li>
                        <li>• Business use documentation</li>
                        <li>• Client meeting records</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <h3 className="text-lg  text-yellow-900 mb-2">Mileage Log Requirements:</h3>
                <p className="text-yellow-800 text-sm">
                  Your mileage log should include: date, destination, purpose, starting odometer reading, 
                  ending odometer reading, total kilometers, and business use percentage. Keep this log 
                  throughout the year, not just at tax time.
                </p>
              </div>
            </section>

            <section id="examples" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Real-World Examples</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Example 1: Photographer</h3>
                  <p className="text-slate-600 mb-3">
                    <strong>Lisa drives to client locations for photo shoots</strong>
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Detailed Method:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• Total expenses: $8,000</p>
                        <p>• Business use: 70%</p>
                        <p>• Deduction: $8,000 × 70% = $5,600</p>
                      </div>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Simplified Method:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• Business km: 8,000</p>
                        <p>• Rate: $0.70/km</p>
                        <p>• Deduction: 8,000 × $0.70 = $5,600</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-slate-50 rounded">
                    <p className=" text-slate-900">Both methods give the same result: $5,600</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl  text-slate-900 mb-4">Example 2: Consultant</h3>
                  <p className="text-slate-600 mb-3">
                    <strong>David drives to client meetings and conferences</strong>
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Detailed Method:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• Total expenses: $12,000</p>
                        <p>• Business use: 40%</p>
                        <p>• Deduction: $12,000 × 40% = $4,800</p>
                      </div>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Simplified Method:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• Business km: 6,000</p>
                        <p>• Rate: $0.70/km</p>
                        <p>• Deduction: 6,000 × $0.70 = $4,200</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-slate-50 rounded">
                    <p className=" text-slate-900">Choose detailed method: $4,800 (higher)</p>
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
                    <li>• Claiming 100% of vehicle expenses</li>
                    <li>• Not keeping a mileage log</li>
                    <li>• Including personal trips</li>
                    <li>• Not calculating business use percentage</li>
                    <li>• Mixing up the two methods</li>
                    <li>• Not keeping receipts</li>
                  </ul>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-6">
                  <h3 className="text-lg  text-green-900 mb-3">✅ Best Practices</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Keep detailed mileage logs</li>
                    <li>• Calculate business use percentage accurately</li>
                    <li>• Choose the method that gives higher deduction</li>
                    <li>• Keep all receipts and documentation</li>
                    <li>• Separate business and personal use</li>
                    <li>• Review your records regularly</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="tips" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Tips for Maximizing Deductions</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg  text-blue-900 mb-4">💡 Maximization Tips</h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>• Use a mileage tracking app</li>
                    <li>• Keep detailed records throughout the year</li>
                    <li>• Calculate both methods and choose higher</li>
                    <li>• Plan business trips efficiently</li>
                    <li>• Consider vehicle choice for tax benefits</li>
                    <li>• Keep all receipts and documentation</li>
                    <li>• Review your records monthly</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg  text-green-900 mb-4">📊 Planning Strategies</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Plan business trips strategically</li>
                    <li>• Consider the tax impact of vehicle purchases</li>
                    <li>• Keep business and personal use separate</li>
                    <li>• Review your deduction method annually</li>
                    <li>• Consider the impact on capital gains</li>
                    <li>• Plan for potential CRA audits</li>
                    <li>• Consult professionals for complex situations</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-2xl  text-slate-900 mb-4 text-center">Calculate Your Vehicle Deductions</h3>
              <p className="text-slate-600 text-center mb-6">
                Use our free T2125 calculator to estimate your vehicle deductions and overall tax situation.
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
