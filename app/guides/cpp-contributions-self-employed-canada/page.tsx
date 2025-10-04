import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "CPP Contributions for Self-Employed Canadians: Explained Simply | Tallo",
  description: "Complete guide to Canada Pension Plan contributions for self-employed individuals. Learn rates, calculations, payment schedules, and benefits.",
  keywords: [
    "CPP contributions self-employed Canada",
    "CPP self-employed rates",
    "Canada Pension Plan freelancers",
    "CPP calculation self-employed",
    "CPP maximum contribution",
    "self-employed CPP benefits",
    "CPP payment schedule",
    "Canadian CPP self-employed",
    "CPP contribution limits",
    "freelancer CPP contributions",
  ],
  openGraph: {
    title: "CPP Contributions for Self-Employed Canadians: Explained Simply",
    description: "Complete guide to Canada Pension Plan contributions for self-employed individuals. Learn rates, calculations, payment schedules, and benefits.",
    type: "article",
  },
}

export default function CPPContributionsSelfEmployed() {
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
            <span className="text-slate-900">CPP Contributions Self-Employed</span>
          </div>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                Contributions
              </span>
              <span className="text-sm text-slate-500">7 min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              CPP Contributions for Self-Employed Canadians: Explained Simply
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Everything about Canada Pension Plan contributions for self-employed individuals, including rates, 
              calculations, payment schedules, and how to maximize your retirement benefits.
            </p>
          </header>

          {/* Table of Contents */}
          <div className="bg-white rounded-xl p-6 mb-12 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#what-is-cpp" className="hover:text-blue-600">What is CPP and Why It Matters</a></li>
              <li><a href="#self-employed-rates" className="hover:text-blue-600">Self-Employed CPP Rates and Limits</a></li>
              <li><a href="#calculation" className="hover:text-blue-600">How to Calculate Your CPP Contributions</a></li>
              <li><a href="#payment-schedule" className="hover:text-blue-600">Payment Schedule and Deadlines</a></li>
              <li><a href="#benefits" className="hover:text-blue-600">CPP Benefits for Self-Employed</a></li>
              <li><a href="#examples" className="hover:text-blue-600">Real-World Examples</a></li>
              <li><a href="#tips" className="hover:text-blue-600">Tips for CPP Planning</a></li>
              <li><a href="#common-questions" className="hover:text-blue-600">Common Questions</a></li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <section id="what-is-cpp" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">What is CPP and Why It Matters</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                The Canada Pension Plan (CPP) is a social insurance program that provides retirement, disability, 
                and survivor benefits to Canadians. As a self-employed individual, you're responsible for paying 
                both the employer and employee portions of CPP contributions.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Key Points About CPP:</h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• Provides retirement income starting at age 60</li>
                  <li>• Offers disability benefits if you become unable to work</li>
                  <li>• Provides survivor benefits to your family</li>
                  <li>• Contributions are mandatory for self-employed individuals</li>
                  <li>• You pay both employer and employee portions (9.9% total)</li>
                </ul>
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">
                Unlike employees who only pay 5.95% (with their employer paying the other 5.95%), 
                self-employed individuals pay the full 9.9% themselves. This higher rate reflects 
                the fact that you're both the employer and employee in your business.
              </p>
            </section>

            <section id="self-employed-rates" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Self-Employed CPP Rates and Limits</h2>
              
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">2024 CPP Contribution Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Contribution Rates</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Self-employed rate: 9.9%</li>
                        <li>• Employee rate: 5.95%</li>
                        <li>• Employer rate: 5.95%</li>
                        <li>• You pay both portions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Contribution Limits</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Maximum earnings: $68,500</li>
                        <li>• Basic exemption: $3,500</li>
                        <li>• Maximum contribution: $3,867.50</li>
                        <li>• Minimum income to contribute: $3,500</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Notes:</h3>
                <ul className="text-yellow-800 space-y-1 text-sm">
                  <li>• CPP rates and limits are updated annually</li>
                  <li>• You only pay CPP on net business income (after expenses)</li>
                  <li>• If you have both employment and self-employment income, CPP is calculated on total income</li>
                  <li>• CPP contributions are tax-deductible</li>
                  <li>• You can't opt out of CPP contributions</li>
                </ul>
              </div>
            </section>

            <section id="calculation" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">How to Calculate Your CPP Contributions</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Calculating your CPP contributions is straightforward once you understand the formula and limits.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">CPP Calculation Formula</h3>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className="font-semibold mb-2">Step 1: Calculate contributory earnings</p>
                    <p className="text-slate-700">Contributory Earnings = Net Business Income - $3,500 (basic exemption)</p>
                    <p className="font-semibold mb-2 mt-4">Step 2: Apply the rate</p>
                    <p className="text-slate-700">CPP Contribution = Contributory Earnings × 9.9%</p>
                    <p className="font-semibold mb-2 mt-4">Step 3: Apply the maximum limit</p>
                    <p className="text-slate-700">Final CPP = Minimum of (calculated amount, $3,867.50)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-400 p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Example 1: Low Income</h3>
                  <p className="text-green-800 text-sm mb-3">
                    <strong>Net business income: $25,000</strong>
                  </p>
                  <div className="bg-white p-4 rounded text-sm">
                    <p>• Contributory earnings: $25,000 - $3,500 = $21,500</p>
                    <p>• CPP calculation: $21,500 × 9.9% = $2,128.50</p>
                    <p>• Below maximum, so CPP = $2,128.50</p>
                  </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Example 2: High Income</h3>
                  <p className="text-green-800 text-sm mb-3">
                    <strong>Net business income: $80,000</strong>
                  </p>
                  <div className="bg-white p-4 rounded text-sm">
                    <p>• Contributory earnings: $80,000 - $3,500 = $76,500</p>
                    <p>• CPP calculation: $76,500 × 9.9% = $7,573.50</p>
                    <p>• Above maximum, so CPP = $3,867.50 (capped)</p>
                  </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Example 3: Very Low Income</h3>
                  <p className="text-green-800 text-sm mb-3">
                    <strong>Net business income: $2,000</strong>
                  </p>
                  <div className="bg-white p-4 rounded text-sm">
                    <p>• Contributory earnings: $2,000 - $3,500 = -$1,500</p>
                    <p>• Below minimum threshold, so CPP = $0</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="payment-schedule" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Payment Schedule and Deadlines</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                CPP contributions are paid along with your income tax when you file your T1 return. 
                However, you may need to make quarterly installments if you expect to owe more than $3,000 in total taxes.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Methods</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Annual Payment (Most Common)</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Pay with your T1 return</li>
                        <li>• Due by April 30 (or June 15 if self-employed only)</li>
                        <li>• Can pay online, by mail, or in person</li>
                        <li>• Interest charged if late</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Quarterly Installments</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Required if total tax > $3,000</li>
                        <li>• Due: Mar 15, Jun 15, Sep 15, Dec 15</li>
                        <li>• Can estimate or use CRA's suggested amounts</li>
                        <li>• Penalty for underpayment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Late Payment Penalties:</h3>
                <p className="text-red-800 text-sm">
                  If you don't pay your CPP contributions on time, you'll be charged interest on the outstanding amount. 
                  The interest rate is typically around 6-8% annually, compounded daily. This can add up quickly, 
                  so it's important to pay on time or set up a payment plan with the CRA.
                </p>
              </div>
            </section>

            <section id="benefits" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">CPP Benefits for Self-Employed</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Your CPP contributions entitle you to the same benefits as employees, including retirement, 
                disability, and survivor benefits.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Retirement Benefits</h3>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Start as early as age 60</li>
                    <li>• Full benefits at age 65</li>
                    <li>• Maximum benefit: ~$1,300/month (2024)</li>
                    <li>• Based on your contribution history</li>
                    <li>• Indexed to inflation</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Disability Benefits</h3>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• If you become unable to work</li>
                    <li>• Must have contributed in 4 of last 6 years</li>
                    <li>• Maximum benefit: ~$1,500/month (2024)</li>
                    <li>• Includes children's benefits</li>
                    <li>• Medical assessment required</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Survivor Benefits</h3>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• For your spouse/common-law partner</li>
                    <li>• For your dependent children</li>
                    <li>• Based on your contribution history</li>
                    <li>• Lump sum death benefit: $2,500</li>
                    <li>• Monthly survivor pension</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Maximizing Your CPP Benefits:</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Contribute the maximum amount each year</li>
                  <li>• Start contributing as early as possible</li>
                  <li>• Consider delaying retirement to age 70 for higher benefits</li>
                  <li>• Keep detailed records of your contributions</li>
                  <li>• Review your CPP statement annually</li>
                </ul>
              </div>
            </section>

            <section id="examples" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Real-World Examples</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Let's look at how CPP contributions work in different scenarios:
              </p>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Scenario 1: New Freelancer</h3>
                  <p className="text-slate-600 mb-3">
                    <strong>Sarah, a freelance graphic designer, net income: $35,000</strong>
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">CPP Calculation:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• Net income: $35,000</p>
                        <p>• Basic exemption: $3,500</p>
                        <p>• Contributory earnings: $31,500</p>
                        <p>• CPP rate: 9.9%</p>
                        <p>• CPP contribution: $3,118.50</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Tax Impact:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• CPP is tax-deductible</p>
                        <p>• Reduces taxable income by $3,118.50</p>
                        <p>• Tax savings: ~$780 (at 25% rate)</p>
                        <p>• Net cost: ~$2,338</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Scenario 2: High-Income Consultant</h3>
                  <p className="text-slate-600 mb-3">
                    <strong>Mike, a business consultant, net income: $120,000</strong>
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">CPP Calculation:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• Net income: $120,000</p>
                        <p>• Basic exemption: $3,500</p>
                        <p>• Contributory earnings: $116,500</p>
                        <p>• CPP rate: 9.9%</p>
                        <p>• CPP contribution: $3,867.50 (capped)</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Tax Impact:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• CPP is tax-deductible</p>
                        <p>• Reduces taxable income by $3,867.50</p>
                        <p>• Tax savings: ~$1,160 (at 30% rate)</p>
                        <p>• Net cost: ~$2,707</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Scenario 3: Mixed Income</h3>
                  <p className="text-slate-600 mb-3">
                    <strong>Lisa, part-time employee + freelancer, employment income: $40,000, self-employment: $20,000</strong>
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">CPP Calculation:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• Total income: $60,000</p>
                        <p>• Employment CPP: $2,380 (5.95% of $40,000)</p>
                        <p>• Self-employment CPP: $1,633 (9.9% of $16,500)</p>
                        <p>• Total CPP: $4,013</p>
                        <p>• Capped at: $3,867.50</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Key Points:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• CPP calculated on total income</p>
                        <p>• Employment portion paid by employer</p>
                        <p>• Self-employment portion paid by you</p>
                        <p>• Both portions are tax-deductible</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="tips" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Tips for CPP Planning</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Here are some strategies to help you make the most of your CPP contributions:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">✅ CPP Planning Strategies</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Set aside money monthly for CPP payments</li>
                    <li>• Consider quarterly installments to avoid large annual payments</li>
                    <li>• Keep detailed records of all contributions</li>
                    <li>• Review your CPP statement annually</li>
                    <li>• Plan for CPP in your retirement budget</li>
                    <li>• Consider the impact of early or late retirement</li>
                    <li>• Factor CPP into your overall retirement planning</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">📊 Record Keeping</h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>• Keep copies of all T1 returns</li>
                    <li>• Save CPP contribution receipts</li>
                    <li>• Track your contribution history</li>
                    <li>• Monitor your CPP statement online</li>
                    <li>• Keep business income records</li>
                    <li>• Document any gaps in contributions</li>
                    <li>• Plan for catch-up contributions if needed</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="common-questions" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Common Questions</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Q: Can I opt out of CPP contributions?</h3>
                  <p className="text-slate-600 text-sm">
                    A: No, CPP contributions are mandatory for all self-employed individuals with net business income over $3,500. 
                    You cannot opt out, even if you have other retirement savings.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Q: What if I can't afford to pay CPP?</h3>
                  <p className="text-slate-600 text-sm">
                    A: If you're struggling financially, contact the CRA to discuss payment arrangements. 
                    You may be able to set up a payment plan, but interest will still apply to outstanding amounts.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Q: Do I get CPP benefits if I contribute less than the maximum?</h3>
                  <p className="text-slate-600 text-sm">
                    A: Yes, your CPP benefits are based on your actual contribution history. 
                    Contributing less means lower benefits, but you'll still receive some retirement income.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Q: Can I make catch-up CPP contributions?</h3>
                  <p className="text-slate-600 text-sm">
                    A: No, you cannot make catch-up contributions for past years. 
                    CPP contributions are calculated annually based on your current year's income.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Q: What happens if I have a business loss?</h3>
                  <p className="text-slate-600 text-sm">
                    A: If your net business income is below $3,500, you don't need to make CPP contributions. 
                    However, you won't earn CPP credits for that year, which may affect your future benefits.
                  </p>
                </div>
              </div>
            </section>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">Calculate Your CPP Contributions</h3>
              <p className="text-slate-600 text-center mb-6">
                Use our free calculators to estimate your CPP contributions and overall tax situation.
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
