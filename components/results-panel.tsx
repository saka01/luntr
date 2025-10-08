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
    // Use simple string formatting to avoid hydration issues
    return `$${Math.round(value).toLocaleString()}`
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (!taxData.province) {
    return (
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Select a province to see your tax calculation</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl">
      <CardContent className="p-6 space-y-4">
        {/* After-Tax Income - Highlighted at top */}
        <div className="flex justify-between items-center p-4 bg-green-300/20 border border-green-300/30 rounded-lg">
          <div>
            <div className="text-sm font-medium text-green-700 dark:text-green-300">After-Tax Income</div>
            <div className="text-xs text-muted-foreground">Your take-home pay</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{formatCurrency(results.afterTaxIncome)}</div>
          </div>
        </div>

        {/* Income Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Income</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(results.totalIncome)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Deductions</span>
            <span className="text-sm font-medium text-card-foreground">−{formatCurrency(results.totalDeductions)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Taxable Income</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(results.taxableIncome)}</span>
          </div>
        </div>

        {/* Business Income Summary - Under Taxable Income */}
        <div className="pt-3 border-t border-border space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Business Income</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(taxData.selfEmploymentIncome)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Net Business Income</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(results.netBusinessIncome)}</span>
          </div>
        </div>

        {/* Tax Breakdown */}
        <div className="pt-3 border-t border-border space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Federal Tax</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(results.federalTax)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Provincial Tax</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(results.provincialTax)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">CPP Contributions</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(results.cppContributions)}</span>
          </div>
        </div>

        {/* Tax Rates */}
        <div className="pt-3 border-t border-border space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Average Tax Rate</span>
            <span className="text-sm font-medium text-card-foreground">{formatPercent(results.averageTaxRate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Marginal Tax Rate</span>
            <span className="text-sm font-medium text-card-foreground">{formatPercent(results.marginalTaxRate)}</span>
          </div>
        </div>

        {/* Refund/Owed - Highlighted */}
        {taxData.taxesPaid > 0 && (
          <div className="pt-3 border-t border-border animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Taxes Paid</span>
              <span className="text-sm font-medium text-card-foreground">{formatCurrency(taxData.taxesPaid)}</span>
            </div>
            <div className={`flex justify-between items-center mt-2 p-3 rounded-lg ${
              results.totalTax - taxData.taxesPaid >= 0 
                ? 'bg-red-500/10 border border-red-500/20' 
                : 'bg-green-300/20 border border-green-300/30'
            }`}>
              <span className={`font-medium ${
                results.totalTax - taxData.taxesPaid >= 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-700 dark:text-green-300'
              }`}>
                {results.totalTax - taxData.taxesPaid >= 0 ? 'Taxes owed to CRA' : 'Refund from CRA'}
              </span>
              <span className={`font-bold text-lg ${
                results.totalTax - taxData.taxesPaid >= 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-700 dark:text-green-300'
              }`}>
                {formatCurrency(Math.abs(results.totalTax - taxData.taxesPaid))}
              </span>
            </div>
          </div>
        )}

        {/* Business Expenses Deducted - Highlighted with Breakdown */}
        <div className="pt-3 border-t border-border">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Business Tax Savings</div>
                <div className="text-xs text-muted-foreground">A breakdown of declared business tax expenses</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(results.businessExpenses)}</div>
              </div>
            </div>
            
            {/* Detailed Deduction Breakdown */}
            <div className="space-y-2 pt-3 border-t border-blue-500/20">
              {/* <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Deduction Breakdown</div> */}
              {taxData.vehicleExpense > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Vehicle Expenses ({taxData.vehicleBusinessUse}%)</span>
                  <span className="text-card-foreground">−{formatCurrency((taxData.vehicleExpense * taxData.vehicleBusinessUse) / 100)}</span>
                </div>
              )}
              {taxData.homeOfficeExpense > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Home Office ({taxData.homeOfficeBusinessUse}%)</span>
                  <span className="text-card-foreground">−{formatCurrency((taxData.homeOfficeExpense * taxData.homeOfficeBusinessUse) / 100)}</span>
                </div>
              )}
              {taxData.mealsExpense > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Meals & Entertainment (50%)</span>
                  <span className="text-card-foreground">−{formatCurrency(taxData.mealsExpense * 0.5)}</span>
                </div>
              )}
              {taxData.advertisingExpense > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Advertising & Marketing</span>
                  <span className="text-card-foreground">−{formatCurrency(taxData.advertisingExpense)}</span>
                </div>
              )}
              {taxData.softwareExpense > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Software & Subscriptions</span>
                  <span className="text-card-foreground">−{formatCurrency(taxData.softwareExpense)}</span>
                </div>
              )}
              {taxData.travelExpense > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Travel Expenses</span>
                  <span className="text-card-foreground">−{formatCurrency(taxData.travelExpense)}</span>
                </div>
              )}
              {taxData.professionalFeesExpense > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Professional Fees</span>
                  <span className="text-card-foreground">−{formatCurrency(taxData.professionalFeesExpense)}</span>
                </div>
              )}
              {results.businessExpenses === 0 && (
                <div className="text-sm text-muted-foreground italic">No business expenses entered</div>
              )}
            </div>
          </div>
        </div>

        {/* Promotional CTA Section */}
        <div className="pt-4 p-6 bg-primary/10 border border-primary/20 rounded-lg">
          <h3 className="text-xl text-primary leading-tight mb-3 font-bold">
            Find $450 - $2,670* in business deductions           
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Tallo is Canada's leading AI-powered tax deduction tool for freelancers and self-employed professionals, trusted by 1M Canadians.    
          </p>
          <Button className="flex flex-row justify-center align-center bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors">
            Try Tallo for free
            <span className="ml-2">▶</span>
          </Button>
          <p className="text-xs text-muted-foreground leading-relaxed mt-3 italic">
            *Based on the average deductions claimed by users with income profiles similar to yours.
          </p>
        </div>

        {/* Detailed Summary Explanation Section */}
        <div className="pt-4">
          <h3 className="text-lg text-card-foreground mb-3">Summary</h3>
          <p className="text-sm leading-relaxed text-muted-foreground mb-3">
            If you make {formatCurrency(results.totalIncome)} a year living in {taxData.province}, you will be taxed{" "}
            {formatCurrency(results.totalTax)}. That means your net pay will be {formatCurrency(results.afterTaxIncome)}{" "}
            per year, or {formatCurrency(results.afterTaxIncome / 12)} per month. Your average tax rate is{" "}
            {formatPercent(results.averageTaxRate)} and your marginal tax rate is{" "}
            {formatPercent(results.marginalTaxRate)}. This marginal tax rate means your immediate additional income will
            be taxed at this rate. For instance, an increase of $100 in your income will be taxed $
            {((results.marginalTaxRate / 100) * 100).toFixed(0)}, meaning that your net pay will only increase by $
            {(100 - (results.marginalTaxRate / 100) * 100).toFixed(0)}.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground/70">
            These calculations are approximate and include the following non-refundable tax credits: the basic personal
            amount, CPP contributions, and the Canada employment amount. After-tax income is your total income net of
            federal tax, provincial/territorial tax, and payroll tax. Rates are current as of 2025.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
