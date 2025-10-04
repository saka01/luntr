"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { TaxData } from "./tax-calculator"
import { calculateTax } from "@/lib/tax-calculations"

type Props = {
  taxData: TaxData
}

export function ResultsPanel({ taxData }: Props) {
  const results = calculateTax(taxData)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (!taxData.province) {
    return (
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Select a province to see your tax calculation</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-2xl">Tax Summary</CardTitle>
        <CardDescription>Real-time calculation based on your inputs</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Summary Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Income Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Income</span>
              <span className="font-medium">{formatCurrency(results.totalIncome)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Deductions</span>
              <span className="font-medium text-accent">−{formatCurrency(results.totalDeductions)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between">
              <span className="font-semibold">Taxable Income</span>
              <span className="font-semibold">{formatCurrency(results.taxableIncome)}</span>
            </div>
          </div>
        </div>

        {/* Tax Breakdown */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Tax Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Federal Tax</span>
              <span className="font-medium">{formatCurrency(results.federalTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Provincial Tax</span>
              <span className="font-medium">{formatCurrency(results.provincialTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">CPP Contributions</span>
              <span className="font-medium">{formatCurrency(results.cppContributions)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between">
              <span className="font-semibold">Total Tax Owing</span>
              <span className="font-semibold text-lg">{formatCurrency(results.totalTax)}</span>
            </div>
            {taxData.taxesPaid > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes Already Paid</span>
                  <span className="font-medium">−{formatCurrency(taxData.taxesPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">
                    Balance {results.totalTax - taxData.taxesPaid >= 0 ? "Owing" : "Refund"}
                  </span>
                  <span
                    className={`font-semibold ${results.totalTax - taxData.taxesPaid >= 0 ? "text-destructive" : "text-accent"}`}
                  >
                    {formatCurrency(Math.abs(results.totalTax - taxData.taxesPaid))}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Net Income */}
        <div className="p-4 bg-accent/10 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">After-Tax Income</span>
            <span className="text-2xl font-bold text-accent">{formatCurrency(results.afterTaxIncome)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Average Tax Rate</span>
            <span className="font-medium">{formatPercent(results.averageTaxRate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Marginal Tax Rate</span>
            <span className="font-medium">{formatPercent(results.marginalTaxRate)}</span>
          </div>
        </div>

        {/* T2125 Summary */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">T2125 Business Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Business Income</span>
              <span className="font-medium">{formatCurrency(taxData.selfEmploymentIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Business Expenses</span>
              <span className="font-medium">−{formatCurrency(results.businessExpenses)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between">
              <span className="font-semibold">Net Business Income</span>
              <span className="font-semibold">{formatCurrency(results.netBusinessIncome)}</span>
            </div>
          </div>
        </div>

        {/* Promotional CTA Section */}
        <div className="space-y-3 pt-4 p-6 bg-purple-100 rounded-lg">
          <h3 className="font-bold text-xl text-purple-950 leading-tight">
            Find $450 - $2670* in business deductions           
          </h3>
          <p className="text-sm text-purple-900 leading-relaxed">
            Tallo is Canada’s leading AI-powered tax deduction tool for freelancers and self-employed professionals, trusted by 1M Canadians.    
          </p>
          <Button className="flex flex-row justify-center align-center bg-purple-600 text-white hover:bg-purple-700 w-min" size="lg">
            Try Tallo for free
            <span>▶</span>
          </Button>
          <p className="text-xs text-purple-800 leading-relaxed">
            *Based on the average deductions claimed by users with income profiles similar to yours.
          </p>
        </div>

        {/* Detailed Summary Explanation Section */}
        <div className="space-y-4 pt-4">
          <h3 className="font-bold text-lg">Summary</h3>
          <p className="text-sm leading-relaxed text-foreground/90">
            If you make {formatCurrency(results.totalIncome)} a year living in {taxData.province}, you will be taxed{" "}
            {formatCurrency(results.totalTax)}. That means your net pay will be {formatCurrency(results.afterTaxIncome)}{" "}
            per year, or {formatCurrency(results.afterTaxIncome / 12)} per month. Your average tax rate is{" "}
            {formatPercent(results.averageTaxRate)} and your marginal tax rate is{" "}
            {formatPercent(results.marginalTaxRate)}. This marginal tax rate means your immediate additional income will
            be taxed at this rate. For instance, an increase of $100 in your income will be taxed $
            {((results.marginalTaxRate / 100) * 100).toFixed(0)}, meaning that your net pay will only increase by $
            {(100 - (results.marginalTaxRate / 100) * 100).toFixed(0)}.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            These calculations are approximate and include the following non-refundable tax credits: the basic personal
            amount, CPP contributions, and the Canada employment amount. After-tax income is your total income net of
            federal tax, provincial/territorial tax, and payroll tax. Rates are current as of 2025.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
