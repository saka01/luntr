import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "List of Common T2125 Deductions (With Examples) | Tallo",
  description: "Complete list of T2125 deductions for Canadian freelancers with real examples and CRA guidelines. Maximize your tax savings legally.",
  keywords: [
    "T2125 deductions list",
    "Canadian freelancer deductions",
    "business expenses Canada",
    "T2125 deductible expenses",
    "freelancer tax deductions",
    "self-employed deductions",
    "CRA business expenses",
    "T2125 expense categories",
    "Canadian tax deductions",
    "freelancer write-offs",
  ],
  openGraph: {
    title: "List of Common T2125 Deductions (With Examples)",
    description: "Complete list of T2125 deductions for Canadian freelancers with real examples and CRA guidelines. Maximize your tax savings legally.",
    type: "article",
  },
}

export default function T2125DeductionsList() {
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
            <span className="text-slate-900">T2125 Deductions List</span>
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
              List of Common T2125 Deductions (With Examples)
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              A comprehensive list of deductible expenses for Canadian freelancers, complete with real-world examples, 
              CRA guidelines, and practical tips to maximize your tax savings legally.
            </p>
          </header>

          {/* Table of Contents */}
          <div className="bg-white rounded-xl p-6 mb-12 shadow-sm border border-slate-200">
            <h2 className="text-xl  text-slate-900 mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#office-supplies" className="hover:text-blue-600">Office Supplies & Equipment</a></li>
              <li><a href="#home-office" className="hover:text-blue-600">Home Office Expenses</a></li>
              <li><a href="#professional-development" className="hover:text-blue-600">Professional Development</a></li>
              <li><a href="#vehicle-expenses" className="hover:text-blue-600">Vehicle & Transportation</a></li>
              <li><a href="#professional-services" className="hover:text-blue-600">Professional Services</a></li>
              <li><a href="#marketing" className="hover:text-blue-600">Marketing & Advertising</a></li>
              <li><a href="#technology" className="hover:text-blue-600">Technology & Software</a></li>
              <li><a href="#travel" className="hover:text-blue-600">Business Travel</a></li>
              <li><a href="#meals-entertainment" className="hover:text-blue-600">Meals & Entertainment</a></li>
              <li><a href="#insurance" className="hover:text-blue-600">Insurance & Legal</a></li>
              <li><a href="#other-deductions" className="hover:text-blue-600">Other Deductions</a></li>
              <li><a href="#deduction-rules" className="hover:text-blue-600">Important Deduction Rules</a></li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <section id="office-supplies" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Office Supplies & Equipment</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                These are the most common and straightforward deductions for freelancers. They include items you use 
                exclusively for your business operations.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">Deductible Office Supplies:</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Basic Supplies</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Paper, pens, pencils, notebooks</li>
                        <li>• Staplers, paper clips, folders</li>
                        <li>• Printer ink and toner cartridges</li>
                        <li>• Business cards and letterhead</li>
                        <li>• Postage and shipping supplies</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Equipment</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Computers, laptops, tablets</li>
                        <li>• Printers, scanners, fax machines</li>
                        <li>• Office furniture (desks, chairs)</li>
                        <li>• Filing cabinets and storage</li>
                        <li>• Small tools and equipment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <h3 className="text-lg  text-blue-900 mb-2">Real Example:</h3>
                <p className="text-blue-800 text-sm">
                  <strong>Sarah, a freelance graphic designer:</strong> "I bought a new MacBook Pro for $2,500, 
                  Adobe Creative Suite subscription for $600/year, and various design software licenses for $300. 
                  I also purchased a Wacom tablet for $400 and office supplies like paper and pens for $200. 
                  Total deduction: $3,600."
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <h3 className="text-lg  text-yellow-900 mb-2">Important Notes:</h3>
                <ul className="text-yellow-800 text-sm space-y-1">
                  <li>• Equipment over $500 may need to be depreciated (Capital Cost Allowance)</li>
                  <li>• Must be used 100% for business purposes</li>
                  <li>• Keep receipts and proof of business use</li>
                </ul>
              </div>
            </section>

            <section id="home-office" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Home Office Expenses</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                If you work from home, you can deduct a portion of your home expenses based on the percentage 
                of your home used for business purposes.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">Deductible Home Office Expenses:</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Direct Expenses (100% deductible)</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Home office furniture and equipment</li>
                        <li>• Business phone line</li>
                        <li>• Internet service (business portion)</li>
                        <li>• Office repairs and maintenance</li>
                        <li>• Business insurance for home office</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Indirect Expenses (percentage deductible)</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Rent or mortgage interest</li>
                        <li>• Property taxes</li>
                        <li>• Home insurance</li>
                        <li>• Utilities (heat, electricity, water)</li>
                        <li>• Home maintenance and repairs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
                <h3 className="text-lg  text-green-900 mb-2">Calculation Example:</h3>
                <p className="text-green-800 text-sm mb-3">
                  <strong>Mike, a freelance consultant:</strong> His home office is 100 sq ft in a 1,000 sq ft home (10% business use).
                </p>
                <div className="bg-white p-4 rounded text-sm">
                  <p className="mb-2"><strong>Annual Expenses:</strong></p>
                  <p>• Rent: $24,000 × 10% = $2,400</p>
                  <p>• Utilities: $3,600 × 10% = $360</p>
                  <p>• Internet: $1,200 × 100% = $1,200 (used exclusively for business)</p>
                  <p>• Office furniture: $800 × 100% = $800</p>
                  <p className="mt-2 ">Total home office deduction: $4,760</p>
                </div>
              </div>
            </section>

            <section id="professional-development" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Professional Development</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Education and training that maintains or improves your professional skills are fully deductible.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">Deductible Professional Development:</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Courses & Training</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Online courses and certifications</li>
                        <li>• Professional workshops and seminars</li>
                        <li>• Industry conferences and events</li>
                        <li>• Software training courses</li>
                        <li>• Professional coaching sessions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Educational Materials</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Professional books and e-books</li>
                        <li>• Industry magazines and subscriptions</li>
                        <li>• Online learning platforms</li>
                        <li>• Professional development software</li>
                        <li>• Research materials and databases</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <h3 className="text-lg  text-blue-900 mb-2">Real Example:</h3>
                <p className="text-blue-800 text-sm">
                  <strong>David, a freelance web developer:</strong> "I took a React.js course for $500, 
                  attended a web development conference for $800 (including travel), bought programming books for $200, 
                  and subscribed to online learning platforms for $300/year. Total deduction: $1,800."
                </p>
              </div>
            </section>

            <section id="vehicle-expenses" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Vehicle & Transportation</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Vehicle expenses can be one of your largest deductions, but they require careful tracking and calculation.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">Vehicle Expense Options:</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Method 1: Detailed Method (Actual Expenses)</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Gas and oil</li>
                        <li>• Insurance</li>
                        <li>• License and registration</li>
                        <li>• Maintenance and repairs</li>
                        <li>• Depreciation (Capital Cost Allowance)</li>
                        <li>• Interest on vehicle loan</li>
                        <li>• Parking and tolls</li>
                      </ul>
                      <p className="text-xs text-slate-500 mt-2">Multiply by business use percentage</p>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Method 2: Simplified Method (Per KM Rate)</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• 2024 rate: $0.70 per business kilometer</li>
                        <li>• Track business kilometers only</li>
                        <li>• No need to track actual expenses</li>
                        <li>• Cannot claim depreciation or interest</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
                <h3 className="text-lg  text-green-900 mb-2">Calculation Example:</h3>
                <p className="text-green-800 text-sm mb-3">
                  <strong>Lisa, a freelance photographer:</strong> Drove 5,000 business km in 2024.
                </p>
                <div className="bg-white p-4 rounded text-sm">
                  <p className="mb-2"><strong>Simplified Method:</strong></p>
                  <p>5,000 km × $0.70 = $3,500 deduction</p>
                  <p className="mt-2 mb-2"><strong>Detailed Method (if higher):</strong></p>
                  <p>• Total vehicle expenses: $8,000</p>
                  <p>• Business use: 60%</p>
                  <p>• Deduction: $8,000 × 60% = $4,800</p>
                  <p className="mt-2 ">Choose the higher amount: $4,800</p>
                </div>
              </div>
            </section>

            <section id="professional-services" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Professional Services</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Fees paid to professionals for business-related services are fully deductible.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">Deductible Professional Services:</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Legal & Financial</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Legal fees for business contracts</li>
                        <li>• Accounting and bookkeeping services</li>
                        <li>• Tax preparation fees</li>
                        <li>• Business incorporation costs</li>
                        <li>• Financial planning and consulting</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Business Services</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Business coaching and consulting</li>
                        <li>• Marketing and PR services</li>
                        <li>• IT support and maintenance</li>
                        <li>• Business registration fees</li>
                        <li>• Professional association dues</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="marketing" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Marketing & Advertising</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                All costs associated with promoting your business are deductible.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">Deductible Marketing Expenses:</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Digital Marketing</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Website design and maintenance</li>
                        <li>• Social media advertising</li>
                        <li>• Google Ads and online advertising</li>
                        <li>• Email marketing software</li>
                        <li>• SEO tools and services</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Traditional Marketing</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Business cards and brochures</li>
                        <li>• Print advertising</li>
                        <li>• Trade show booth costs</li>
                        <li>• Promotional materials</li>
                        <li>• Direct mail campaigns</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="technology" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Technology & Software</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Technology is essential for most freelancers, and most tech expenses are deductible.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">Deductible Technology Expenses:</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Software & Subscriptions</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Business software licenses</li>
                        <li>• Cloud storage services</li>
                        <li>• Project management tools</li>
                        <li>• Design and development software</li>
                        <li>• Communication tools (Slack, Zoom)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Hardware & Equipment</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Computers and laptops</li>
                        <li>• Monitors and peripherals</li>
                        <li>• Mobile devices (if used for business)</li>
                        <li>• Networking equipment</li>
                        <li>• Backup drives and storage</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="travel" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Business Travel</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Travel expenses for business purposes are deductible, but personal portions are not.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">Deductible Travel Expenses:</h3>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li>• Airfare, train, or bus tickets for business trips</li>
                    <li>• Hotel accommodations for business travel</li>
                    <li>• Car rentals for business purposes</li>
                    <li>• Taxi, Uber, or public transportation for business</li>
                    <li>• Parking fees for business meetings</li>
                    <li>• Meals while traveling for business (50% deductible)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <h3 className="text-lg  text-yellow-900 mb-2">Important Note:</h3>
                <p className="text-yellow-800 text-sm">
                  If you combine business and personal travel, you can only deduct the business portion. 
                  Keep detailed records of business vs. personal activities during your trip.
                </p>
              </div>
            </section>

            <section id="meals-entertainment" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Meals & Entertainment</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Business meals and entertainment expenses have specific rules and limitations.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">Meals & Entertainment Rules:</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Business Meals (50% deductible)</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Meals with clients or prospects</li>
                        <li>• Meals during business travel</li>
                        <li>• Meals at business conferences</li>
                        <li>• Office lunch meetings</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Entertainment (50% deductible)</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Client entertainment (sports events, shows)</li>
                        <li>• Business-related social events</li>
                        <li>• Holiday parties for clients</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="insurance" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Insurance & Legal</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Business-related insurance and legal expenses are deductible.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">Deductible Insurance & Legal:</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">Insurance</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Professional liability insurance</li>
                        <li>• Business equipment insurance</li>
                        <li>• Errors and omissions insurance</li>
                        <li>• Business interruption insurance</li>
                        <li>• Cyber liability insurance</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Legal & Compliance</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Business registration fees</li>
                        <li>• Trademark and copyright fees</li>
                        <li>• Contract review and drafting</li>
                        <li>• Compliance consulting</li>
                        <li>• Business license fees</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="other-deductions" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Other Deductions</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Additional expenses that may be deductible depending on your business type.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg  text-slate-900 mb-4">Other Deductible Expenses:</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className=" text-slate-800 mb-2">General Business</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Bank fees and service charges</li>
                        <li>• Business phone and internet</li>
                        <li>• Office rent (if not home office)</li>
                        <li>• Utilities for business premises</li>
                        <li>• Cleaning and maintenance</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className=" text-slate-800 mb-2">Industry-Specific</h4>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>• Industry-specific tools and equipment</li>
                        <li>• Professional uniforms and work clothes</li>
                        <li>• Safety equipment and supplies</li>
                        <li>• Industry publications and memberships</li>
                        <li>• Trade association dues</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="deduction-rules" className="mb-12">
              <h2 className="text-3xl  text-slate-900 mb-6">Important Deduction Rules</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Understanding the rules and requirements for claiming deductions will help you stay compliant and maximize your savings.
              </p>

              <div className="space-y-6">
                <div className="bg-red-50 border-l-4 border-red-400 p-6">
                  <h3 className="text-lg  text-red-900 mb-3">❌ What You CANNOT Deduct</h3>
                  <ul className="space-y-2 text-red-800 text-sm">
                    <li>• Personal living expenses (rent, groceries, personal clothing)</li>
                    <li>• Personal portion of mixed-use expenses</li>
                    <li>• Fines, penalties, and traffic tickets</li>
                    <li>• Personal entertainment and recreation</li>
                    <li>• Life insurance premiums (unless for business purposes)</li>
                    <li>• Personal medical expenses</li>
                    <li>• Personal education unrelated to business</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 p-6">
                  <h3 className="text-lg  text-green-900 mb-3">✅ Key Rules to Follow</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Keep receipts and documentation for all expenses</li>
                    <li>• Expenses must be reasonable and necessary for business</li>
                    <li>• Personal portions of mixed expenses are not deductible</li>
                    <li>• Expenses must be incurred in the current tax year</li>
                    <li>• Business use must be clearly documented</li>
                    <li>• Expenses must be ordinary and necessary for your business</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                  <h3 className="text-lg  text-blue-900 mb-3">📋 Record Keeping Requirements</h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>• Keep all receipts and invoices for 6 years</li>
                    <li>• Maintain a detailed expense log with dates and purposes</li>
                    <li>• Document business use percentages for mixed expenses</li>
                    <li>• Keep bank statements and credit card statements</li>
                    <li>• Maintain a mileage log for vehicle expenses</li>
                    <li>• Store records electronically or physically</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-2xl  text-slate-900 mb-4 text-center">Ready to Calculate Your Deductions?</h3>
              <p className="text-slate-600 text-center mb-6">
                Use our free T2125 calculator to get an instant estimate of your self-employment taxes and discover deductions you might be missing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/canada-t2125-tax-calculator"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg  hover:bg-blue-700 transition-colors text-center"
                >
                  Try T2125 Calculator
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
