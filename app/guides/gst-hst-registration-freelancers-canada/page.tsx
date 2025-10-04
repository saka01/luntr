import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "GST/HST for Freelancers: When to Register and How to Calculate | Tallo",
  description: "Complete guide to GST/HST registration for Canadian freelancers. Learn when to register, how to calculate, and stay compliant.",
  keywords: [
    "GST HST freelancers Canada",
    "GST registration freelancers",
    "HST registration self-employed",
    "GST HST calculation Canada",
    "freelancer GST HST",
    "self-employed GST HST",
    "GST HST registration threshold",
    "Canadian GST HST freelancers",
    "GST HST compliance",
    "freelancer tax registration",
  ],
  openGraph: {
    title: "GST/HST for Freelancers: When to Register and How to Calculate",
    description: "Complete guide to GST/HST registration for Canadian freelancers. Learn when to register, how to calculate, and stay compliant.",
    type: "article",
  },
}

export default function GSTHSTRegistrationFreelancers() {
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
            <span className="text-slate-900">GST/HST for Freelancers</span>
          </div>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                Tax Registration
              </span>
              <span className="text-sm text-slate-500">11 min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              GST/HST for Freelancers: When to Register and How to Calculate
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Understanding GST/HST registration requirements and calculations for Canadian freelancers and self-employed individuals. 
              Learn when to register, how to calculate, and stay compliant.
            </p>
          </header>

          {/* Table of Contents */}
          <div className="bg-white rounded-xl p-6 mb-12 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#what-is-gst-hst" className="hover:text-blue-600">What is GST/HST?</a></li>
              <li><a href="#registration-requirements" className="hover:text-blue-600">Registration Requirements</a></li>
              <li><a href="#registration-thresholds" className="hover:text-blue-600">Registration Thresholds</a></li>
              <li><a href="#how-to-register" className="hover:text-blue-600">How to Register</a></li>
              <li><a href="#gst-hst-rates" className="hover:text-blue-600">GST/HST Rates by Province</a></li>
              <li><a href="#calculations" className="hover:text-blue-600">How to Calculate GST/HST</a></li>
              <li><a href="#filing-returns" className="hover:text-blue-600">Filing GST/HST Returns</a></li>
              <li><a href="#common-questions" className="hover:text-blue-600">Common Questions</a></li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <section id="what-is-gst-hst" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">What is GST/HST?</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                The Goods and Services Tax (GST) and Harmonized Sales Tax (HST) are consumption taxes that apply to most goods and services in Canada. 
                As a freelancer, you may need to register for and collect these taxes.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Key Points About GST/HST:</h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• GST is 5% and applies in all provinces</li>
                  <li>• HST combines GST and provincial sales tax</li>
                  <li>• Rates vary by province (5% to 15%)</li>
                  <li>• You collect tax from clients and remit to CRA</li>
                  <li>• You can claim input tax credits on business expenses</li>
                </ul>
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">
                The main difference between GST and HST is that HST is a combined federal and provincial tax, 
                while GST is just the federal portion. The total rate depends on your province.
              </p>
            </section>

            <section id="registration-requirements" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Registration Requirements</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                You must register for GST/HST if you meet certain criteria. Here's what you need to know:
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">When You Must Register:</h3>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li>• Your gross business revenue exceeds $30,000 in a single calendar quarter</li>
                    <li>• Your gross business revenue exceeds $30,000 in four consecutive calendar quarters</li>
                    <li>• You provide taxi or limousine services (regardless of revenue)</li>
                    <li>• You want to claim input tax credits on business expenses</li>
                    <li>• You're a non-resident providing services in Canada</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Note:</h3>
                <p className="text-yellow-800 text-sm">
                  The $30,000 threshold is based on gross revenue (before expenses), not net income. 
                  Even if you have a loss, you must register if you exceed the threshold.
                </p>
              </div>
            </section>

            <section id="registration-thresholds" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Registration Thresholds</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Understanding the different thresholds and when they apply:
              </p>

              <div className="overflow-x-auto mb-8">
                <table className="w-full bg-white rounded-lg shadow-sm border border-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Threshold Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Single Quarter</td>
                      <td className="px-6 py-4 text-sm text-slate-600">$30,000</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Must register if exceeded in any single quarter</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Four Consecutive Quarters</td>
                      <td className="px-6 py-4 text-sm text-slate-600">$30,000</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Must register if exceeded over four consecutive quarters</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Taxi/Limousine</td>
                      <td className="px-6 py-4 text-sm text-slate-600">$0</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Must register regardless of revenue</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Voluntary Registration</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Any amount</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Can register voluntarily to claim input tax credits</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="how-to-register" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">How to Register</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Registering for GST/HST is straightforward and can be done online:
              </p>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Step 1: Gather Required Information</h3>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li>• Your Social Insurance Number (SIN)</li>
                    <li>• Business name and address</li>
                    <li>• Business start date</li>
                    <li>• Expected annual revenue</li>
                    <li>• Business type and activities</li>
                    <li>• Banking information for direct deposit</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Step 2: Register Online</h3>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li>• Visit the CRA's Business Registration Online (BRO) service</li>
                    <li>• Create a CRA My Business Account</li>
                    <li>• Complete the GST/HST registration form</li>
                    <li>• Submit your application</li>
                    <li>• Receive your GST/HST number (usually within 24 hours)</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Step 3: Start Collecting Tax</h3>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li>• Add GST/HST to your invoices</li>
                    <li>• Keep detailed records of all transactions</li>
                    <li>• Set up a system to track input tax credits</li>
                    <li>• Prepare for your first GST/HST return</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="gst-hst-rates" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">GST/HST Rates by Province</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                The GST/HST rate varies by province. Here are the current rates:
              </p>

              <div className="overflow-x-auto mb-8">
                <table className="w-full bg-white rounded-lg shadow-sm border border-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Province</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Rate</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Alberta</td>
                      <td className="px-6 py-4 text-sm text-slate-600">5%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">GST only</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">British Columbia</td>
                      <td className="px-6 py-4 text-sm text-slate-600">5%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">GST only</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Manitoba</td>
                      <td className="px-6 py-4 text-sm text-slate-600">5%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">GST only</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">New Brunswick</td>
                      <td className="px-6 py-4 text-sm text-slate-600">15%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">HST</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Newfoundland and Labrador</td>
                      <td className="px-6 py-4 text-sm text-slate-600">15%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">HST</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Northwest Territories</td>
                      <td className="px-6 py-4 text-sm text-slate-600">5%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">GST only</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Nova Scotia</td>
                      <td className="px-6 py-4 text-sm text-slate-600">15%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">HST</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Nunavut</td>
                      <td className="px-6 py-4 text-sm text-slate-600">5%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">GST only</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Ontario</td>
                      <td className="px-6 py-4 text-sm text-slate-600">13%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">HST</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Prince Edward Island</td>
                      <td className="px-6 py-4 text-sm text-slate-600">15%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">HST</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Quebec</td>
                      <td className="px-6 py-4 text-sm text-slate-600">5%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">GST only</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Saskatchewan</td>
                      <td className="px-6 py-4 text-sm text-slate-600">5%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">GST only</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">Yukon</td>
                      <td className="px-6 py-4 text-sm text-slate-600">5%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">GST only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="calculations" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">How to Calculate GST/HST</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Calculating GST/HST is straightforward once you know the rate for your province:
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">GST/HST Calculation Formula</h3>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className="font-semibold mb-2">Step 1: Determine the rate for your province</p>
                    <p className="text-slate-700">Check the table above for your province's GST/HST rate</p>
                    <p className="font-semibold mb-2 mt-4">Step 2: Calculate the tax</p>
                    <p className="text-slate-700">GST/HST = Invoice Amount × Tax Rate</p>
                    <p className="font-semibold mb-2 mt-4">Step 3: Add to invoice</p>
                    <p className="text-slate-700">Total Amount = Invoice Amount + GST/HST</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-400 p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Example 1: Ontario (13% HST)</h3>
                  <p className="text-green-800 text-sm mb-3">
                    <strong>Invoice amount: $1,000</strong>
                  </p>
                  <div className="bg-white p-4 rounded text-sm">
                    <p>• Invoice amount: $1,000</p>
                    <p>• HST (13%): $1,000 × 0.13 = $130</p>
                    <p>• Total amount: $1,000 + $130 = $1,130</p>
                  </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Example 2: Alberta (5% GST)</h3>
                  <p className="text-green-800 text-sm mb-3">
                    <strong>Invoice amount: $2,500</strong>
                  </p>
                  <div className="bg-white p-4 rounded text-sm">
                    <p>• Invoice amount: $2,500</p>
                    <p>• GST (5%): $2,500 × 0.05 = $125</p>
                    <p>• Total amount: $2,500 + $125 = $2,625</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="filing-returns" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Filing GST/HST Returns</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Once registered, you must file GST/HST returns regularly:
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Filing Requirements</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Filing Frequency</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Annual: Revenue < $1.5M</li>
                        <li>• Quarterly: Revenue $1.5M - $6M</li>
                        <li>• Monthly: Revenue > $6M</li>
                        <li>• Can request different frequency</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Due Dates</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Annual: 3 months after year-end</li>
                        <li>• Quarterly: 1 month after quarter-end</li>
                        <li>• Monthly: 1 month after month-end</li>
                        <li>• Late filing penalties apply</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Late Filing Penalties:</h3>
                <p className="text-red-800 text-sm">
                  Late filing penalties can be significant. For annual returns, the penalty is 1% of the balance owing 
                  for each month (or part of a month) the return is late, up to a maximum of 12%.
                </p>
              </div>
            </section>

            <section id="common-questions" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Common Questions</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Q: Can I register voluntarily before reaching the threshold?</h3>
                  <p className="text-slate-600 text-sm">
                    A: Yes, you can register voluntarily at any time. This allows you to claim input tax credits 
                    on business expenses, which can be beneficial even if you're below the threshold.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Q: What are input tax credits?</h3>
                  <p className="text-slate-600 text-sm">
                    A: Input tax credits allow you to recover the GST/HST you paid on business expenses. 
                    You can claim these credits on your GST/HST return to reduce the amount you owe.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Q: Do I need to charge GST/HST on all my services?</h3>
                  <p className="text-slate-600 text-sm">
                    A: Generally yes, but some services are exempt or zero-rated. Most professional services 
                    are taxable, but you should check the CRA's guidelines for your specific industry.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Q: What if I make a mistake on my GST/HST return?</h3>
                  <p className="text-slate-600 text-sm">
                    A: You can file an amended return to correct errors. If you overpaid, you'll get a refund. 
                    If you underpaid, you'll need to pay the difference plus any applicable penalties and interest.
                  </p>
                </div>
              </div>
            </section>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">Calculate Your GST/HST</h3>
              <p className="text-slate-600 text-center mb-6">
                Use our free calculators to estimate your GST/HST obligations and overall tax situation.
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
