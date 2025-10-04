import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "How to Calculate Self-Employment Tax in Canada (Step-by-Step) | Tallo",
  description: "Complete guide to calculating self-employment taxes in Canada including income tax, CPP contributions, and EI premiums with examples.",
  keywords: [
    "self-employment tax calculation Canada",
    "freelancer tax calculation",
    "Canadian self-employed taxes",
    "CPP contributions calculation",
    "EI premiums self-employed",
    "freelancer tax calculator",
    "self-employment income tax",
    "Canadian tax calculation",
    "freelancer tax rates",
    "self-employed tax formula",
  ],
  openGraph: {
    title: "How to Calculate Self-Employment Tax in Canada (Step-by-Step)",
    description: "Complete guide to calculating self-employment taxes in Canada including income tax, CPP contributions, and EI premiums with examples.",
    type: "article",
  },
}

export default function SelfEmploymentTaxCalculation() {
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
            <span className="text-slate-900">Self-Employment Tax Calculation</span>
          </div>
        </nav>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                Calculations
              </span>
              <span className="text-sm text-slate-500">10 min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              How to Calculate Self-Employment Tax in Canada (Step-by-Step)
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Learn how to calculate your self-employment taxes including income tax, CPP contributions, and EI premiums. 
              Complete with examples and formulas to help you estimate your tax obligations.
            </p>
          </header>

          {/* Table of Contents */}
          <div className="bg-white rounded-xl p-6 mb-12 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#overview" className="hover:text-blue-600">Self-Employment Tax Overview</a></li>
              <li><a href="#components" className="hover:text-blue-600">Components of Self-Employment Tax</a></li>
              <li><a href="#step-by-step" className="hover:text-blue-600">Step-by-Step Calculation Process</a></li>
              <li><a href="#income-tax" className="hover:text-blue-600">Income Tax Calculation</a></li>
              <li><a href="#cpp-contributions" className="hover:text-blue-600">CPP Contributions</a></li>
              <li><a href="#ei-premiums" className="hover:text-blue-600">EI Premiums (Optional)</a></li>
              <li><a href="#examples" className="hover:text-blue-600">Real-World Examples</a></li>
              <li><a href="#quarterly-installments" className="hover:text-blue-600">Quarterly Tax Installments</a></li>
              <li><a href="#tips" className="hover:text-blue-600">Tips for Tax Planning</a></li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <section id="overview" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Self-Employment Tax Overview</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                As a self-employed Canadian, you're responsible for paying several types of taxes that employees don't have to worry about. 
                Understanding these calculations is crucial for proper tax planning and avoiding surprises at tax time.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Key Differences from Employment:</h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• No automatic tax deductions from your income</li>
                  <li>• You pay both employer and employee portions of CPP</li>
                  <li>• EI is optional for most self-employed individuals</li>
                  <li>• You may need to make quarterly tax installments</li>
                  <li>• You can deduct business expenses to reduce taxable income</li>
                </ul>
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">
                The total amount of tax you'll pay depends on your net business income (gross income minus business expenses) 
                and your province of residence, as provincial tax rates vary across Canada.
              </p>
            </section>

            <section id="components" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Components of Self-Employment Tax</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Self-employment tax in Canada consists of three main components:
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">1. Federal Income Tax</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Progressive tax rates applied to your net business income
                  </p>
                  <div className="text-xs text-slate-500">
                    <p>2024 Rates:</p>
                    <p>• 15% on first $55,867</p>
                    <p>• 20.5% on next $55,866</p>
                    <p>• 26% on next $61,400</p>
                    <p>• 29% on next $70,000</p>
                    <p>• 33% on income over $246,752</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">2. Provincial Income Tax</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Additional tax based on your province of residence
                  </p>
                  <div className="text-xs text-slate-500">
                    <p>Varies by province:</p>
                    <p>• BC: 5.06% - 20.5%</p>
                    <p>• ON: 5.05% - 13.16%</p>
                    <p>• AB: 10% flat rate</p>
                    <p>• QC: 14% - 25.75%</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">3. CPP Contributions</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    You pay both employer and employee portions
                  </p>
                  <div className="text-xs text-slate-500">
                    <p>2024 Rate: 9.9%</p>
                    <p>Maximum: $3,867.50</p>
                    <p>Minimum: $0 (if net income < $3,500)</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="step-by-step" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Step-by-Step Calculation Process</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Follow these steps to calculate your total self-employment tax:
              </p>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Step 1: Calculate Net Business Income</h3>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className="font-semibold mb-2">Formula:</p>
                    <p className="text-slate-700">Net Business Income = Gross Business Income - Business Expenses</p>
                  </div>
                  <p className="text-slate-600 text-sm mt-3">
                    This is the amount that will be subject to income tax and CPP contributions.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Step 2: Calculate Federal Income Tax</h3>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className="font-semibold mb-2">Progressive Tax Calculation:</p>
                    <p className="text-slate-700">Apply federal tax rates to your net business income using the brackets above</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Step 3: Calculate Provincial Income Tax</h3>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className="font-semibold mb-2">Provincial Rates:</p>
                    <p className="text-slate-700">Apply your province's tax rates to your net business income</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Step 4: Calculate CPP Contributions</h3>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className="font-semibold mb-2">CPP Formula:</p>
                    <p className="text-slate-700">CPP = Net Business Income × 9.9% (capped at $3,867.50 for 2024)</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Step 5: Add Optional EI Premiums</h3>
                  <div className="bg-slate-50 p-4 rounded text-sm">
                    <p className="font-semibold mb-2">EI Formula (if applicable):</p>
                    <p className="text-slate-700">EI = Net Business Income × 1.66% (capped at $1,049.12 for 2024)</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="income-tax" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Income Tax Calculation</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Income tax is calculated using progressive rates, meaning you pay different rates on different portions of your income.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">2024 Federal Tax Brackets</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-slate-900">Income Range</th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-900">Tax Rate</th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-900">Tax on This Bracket</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="px-4 py-2 text-slate-600">$0 - $55,867</td>
                          <td className="px-4 py-2 text-slate-600">15%</td>
                          <td className="px-4 py-2 text-slate-600">$0 - $8,380</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-slate-600">$55,868 - $111,733</td>
                          <td className="px-4 py-2 text-slate-600">20.5%</td>
                          <td className="px-4 py-2 text-slate-600">$8,380 - $19,857</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-slate-600">$111,734 - $173,133</td>
                          <td className="px-4 py-2 text-slate-600">26%</td>
                          <td className="px-4 py-2 text-slate-600">$19,857 - $35,808</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-slate-600">$173,134 - $246,752</td>
                          <td className="px-4 py-2 text-slate-600">29%</td>
                          <td className="px-4 py-2 text-slate-600">$35,808 - $55,101</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-slate-600">Over $246,752</td>
                          <td className="px-4 py-2 text-slate-600">33%</td>
                          <td className="px-4 py-2 text-slate-600">$55,101+</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Calculation Example:</h3>
                <p className="text-green-800 text-sm mb-3">
                  <strong>Sarah's net business income: $80,000</strong>
                </p>
                <div className="bg-white p-4 rounded text-sm">
                  <p className="mb-2"><strong>Federal Tax Calculation:</strong></p>
                  <p>• First $55,867 × 15% = $8,380.05</p>
                  <p>• Next $24,133 × 20.5% = $4,947.27</p>
                  <p className="mt-2 font-semibold">Total Federal Tax: $13,327.32</p>
                </div>
              </div>
            </section>

            <section id="cpp-contributions" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">CPP Contributions</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                As a self-employed individual, you pay both the employer and employee portions of CPP contributions, 
                which is why the rate is higher than for employees.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">2024 CPP Contribution Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Contribution Rate</h4>
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

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">CPP Calculation Examples:</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded text-sm">
                    <p className="font-semibold mb-2">Example 1: Net income $50,000</p>
                    <p>CPP = ($50,000 - $3,500) × 9.9% = $4,603.50</p>
                    <p className="text-slate-500">But capped at $3,867.50, so CPP = $3,867.50</p>
                  </div>
                  <div className="bg-white p-4 rounded text-sm">
                    <p className="font-semibold mb-2">Example 2: Net income $30,000</p>
                    <p>CPP = ($30,000 - $3,500) × 9.9% = $2,623.50</p>
                  </div>
                  <div className="bg-white p-4 rounded text-sm">
                    <p className="font-semibold mb-2">Example 3: Net income $2,000</p>
                    <p>CPP = $0 (below minimum threshold of $3,500)</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="ei-premiums" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">EI Premiums (Optional)</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Employment Insurance is optional for most self-employed individuals, but you can opt in if you want EI benefits.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Considerations:</h3>
                <ul className="text-yellow-800 space-y-1 text-sm">
                  <li>• EI is optional for most self-employed individuals</li>
                  <li>• You must opt in before you need benefits</li>
                  <li>• Once opted in, you cannot opt out</li>
                  <li>• You must pay premiums for at least 12 months before claiming</li>
                  <li>• Benefits are limited compared to regular EI</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">2024 EI Premium Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Premium Rate</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Self-employed rate: 1.66%</li>
                        <li>• Maximum earnings: $63,200</li>
                        <li>• Maximum premium: $1,049.12</li>
                        <li>• No minimum threshold</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Benefits Available</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Maternity benefits</li>
                        <li>• Parental benefits</li>
                        <li>• Sickness benefits</li>
                        <li>• Compassionate care benefits</li>
                        <li>• Family caregiver benefits</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="examples" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Real-World Examples</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Let's work through complete tax calculations for different income levels:
              </p>

              <div className="space-y-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Example 1: Low Income ($25,000 net)</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Income Tax (Ontario)</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• Federal: $3,750 (15% of $25,000)</p>
                        <p>• Provincial: $1,250 (5.05% of $25,000)</p>
                        <p className="font-semibold">Total Income Tax: $5,000</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Other Contributions</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• CPP: $2,128.50 (9.9% of $21,500)</p>
                        <p>• EI (optional): $415 (1.66% of $25,000)</p>
                        <p className="font-semibold">Total Other: $2,543.50</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-slate-50 rounded">
                    <p className="font-semibold text-slate-900">Total Tax: $7,543.50 (30.2% of net income)</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Example 2: Medium Income ($60,000 net)</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Income Tax (Ontario)</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• Federal: $9,380 (15% of $55,867) + $860 (20.5% of $4,133)</p>
                        <p>• Provincial: $3,030 (5.05% of $60,000)</p>
                        <p className="font-semibold">Total Income Tax: $13,270</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Other Contributions</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• CPP: $3,867.50 (capped at maximum)</p>
                        <p>• EI (optional): $996 (1.66% of $60,000)</p>
                        <p className="font-semibold">Total Other: $4,863.50</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-slate-50 rounded">
                    <p className="font-semibold text-slate-900">Total Tax: $18,133.50 (30.2% of net income)</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Example 3: High Income ($120,000 net)</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Income Tax (Ontario)</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• Federal: $8,380 + $11,453 + $2,149 = $21,982</p>
                        <p>• Provincial: $6,060 (5.05% of $120,000)</p>
                        <p className="font-semibold">Total Income Tax: $28,042</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Other Contributions</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• CPP: $3,867.50 (capped at maximum)</p>
                        <p>• EI (optional): $1,992 (1.66% of $120,000)</p>
                        <p className="font-semibold">Total Other: $5,859.50</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-slate-50 rounded">
                    <p className="font-semibold text-slate-900">Total Tax: $33,901.50 (28.3% of net income)</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="quarterly-installments" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Quarterly Tax Installments</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                If you expect to owe more than $3,000 in taxes (or $1,800 in Quebec), you may need to make quarterly tax installments.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Installment Requirements</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">When Required</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Net tax owing > $3,000 (or $1,800 in QC)</li>
                        <li>• In 2 of the last 3 years</li>
                        <li>• Current year estimate > $3,000</li>
                        <li>• CRA will send you installment reminders</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Payment Schedule</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• March 15 (Q1)</li>
                        <li>• June 15 (Q2)</li>
                        <li>• September 15 (Q3)</li>
                        <li>• December 15 (Q4)</li>
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

            <section id="tips" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Tips for Tax Planning</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Here are some strategies to help you manage your self-employment taxes more effectively:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">✅ Tax Planning Strategies</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Set aside 25-30% of income for taxes</li>
                    <li>• Make quarterly installments to avoid penalties</li>
                    <li>• Maximize business expense deductions</li>
                    <li>• Consider RRSP contributions to reduce taxes</li>
                    <li>• Keep detailed records throughout the year</li>
                    <li>• Use tax software or hire an accountant</li>
                    <li>• Plan major purchases for tax efficiency</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">📊 Record Keeping</h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>• Track all business income and expenses</li>
                    <li>• Keep receipts and invoices organized</li>
                    <li>• Use separate business bank accounts</li>
                    <li>• Maintain a mileage log for vehicle expenses</li>
                    <li>• Document home office calculations</li>
                    <li>• Keep records for 6 years</li>
                    <li>• Consider using accounting software</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">Calculate Your Self-Employment Taxes</h3>
              <p className="text-slate-600 text-center mb-6">
                Use our free calculators to estimate your self-employment taxes and discover potential deductions.
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
