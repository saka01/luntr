import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function InfoSection() {
  return (
    <div className="bg-muted/30 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* What is T2125 */}
        <section id="what-is-t2125">
          <h2 className="text-3xl font-bold mb-6 text-balance">What is the T2125 Form?</h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            The T2125 Statement of Business or Professional Activities is a Canadian tax form used by self-employed
            individuals, freelancers, and independent contractors to report business income and expenses. It calculates
            your net business income, which is then used to determine your total taxable income and tax obligations
            including CPP contributions.
          </p>
        </section>

        {/* Common Deductions */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-balance">Common T2125 Deductions for Freelancers</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Home Office Expenses</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Deduct a portion of rent, utilities, internet, and property taxes based on the percentage of your home
                used for business.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vehicle Expenses</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Gas, insurance, maintenance, and lease payments can be deducted based on business use percentage.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Software & Subscriptions</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Business software, cloud services, professional memberships, and online tools are fully deductible.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Development</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Courses, conferences, books, and training directly related to your business are deductible expenses.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works">
          <h2 className="text-3xl font-bold mb-6 text-balance">How the T2125 Calculator Works</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p className="text-pretty">
              Our calculator uses the latest CRA tax rates and formulas to provide accurate estimates of your tax
              obligations. It calculates federal and provincial taxes based on your province of residence, applies the
              appropriate tax brackets, and computes CPP contributions for self-employed individuals.
            </p>
            <p className="text-pretty">
              The calculator automatically applies CRA rules such as the 50% limit on meals and entertainment expenses,
              business-use percentages for vehicle and home office deductions, and the basic personal amount tax credit.
              Results update in real-time as you enter your information.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <h2 className="text-3xl font-bold mb-6 text-balance">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">Who needs to file a T2125 form?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Any self-employed individual, freelancer, independent contractor, or sole proprietor who earns business
                income must file a T2125 form with their personal tax return. This includes consultants, gig workers,
                and anyone operating a business without incorporating.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">What expenses can I deduct on my T2125?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                You can deduct any reasonable expense incurred to earn business income. Common deductions include home
                office expenses, vehicle costs, software subscriptions, advertising, professional fees, supplies, and
                travel. The expense must be directly related to your business and you must keep receipts.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">How accurate is this calculator?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                This calculator provides estimates based on current CRA tax rates and formulas. While it's designed to
                be accurate for most situations, your actual tax owing may vary based on other factors like tax credits,
                deductions, and specific circumstances. Always consult with a tax professional for personalized advice.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">Do I need to pay CPP as a self-employed person?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes, self-employed individuals must pay both the employee and employer portions of CPP contributions,
                which is approximately 11.9% of net business income (up to the annual maximum). This calculator includes
                CPP contributions in the total tax calculation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">When are tax installments due?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                If you owe more than $3,000 in taxes (after deductions and credits) for the current year and either of
                the two previous years, you must pay quarterly tax installments. These are due March 15, June 15,
                September 15, and December 15 each year.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  )
}
