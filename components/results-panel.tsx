"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { TaxData } from "./tax-calculator"
import { calculateTax } from "@/lib/tax-calculations"
import { motion } from "framer-motion"

type Props = {
  taxData: TaxData
}

export function ResultsPanel({ taxData }: Props) {
  const [isTaxRatesExpanded, setIsTaxRatesExpanded] = useState(false)
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
      <Card className="bg-gradient-to-br from-primary/5 via-card to-secondary/5 border-primary/20 backdrop-blur-sm shadow-xl">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Select a province to see your tax calculation</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-card to-secondary/5 border-primary/20 backdrop-blur-sm shadow-xl">
      <CardContent className="p-6 space-y-4">
        {/* After-Tax Income - Highlighted at top - Only show if self-employment income > 0 */}
        <div className="text-center">
          <p className="text-lg font-bold text-card-foreground">Your Results</p>
        </div>
        {taxData.selfEmploymentIncome > 0 && (
          <div className="flex justify-between items-center p-4 bg-green-300/20 border border-green-300/30 rounded-lg">
            <div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300">After-Tax Income</div>
              <div className="text-xs text-muted-foreground">Your take-home pay</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">{formatCurrency(results.afterTaxIncome)}</div>
            </div>
          </div>
        )}

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

        {/* Total Tax Owed - Only show if there's actual income and tax liability */}
        {results.totalIncome > 0 && (
          results.totalTax > 0 ? (
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between items-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">Total Tax Owed to CRA</div>
                  <div className="text-xs text-muted-foreground">Your total tax liability</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(results.totalTax)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between items-center p-4 bg-green-300/20 border border-green-300/30 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-green-700 dark:text-green-300">No Taxes Owed!</div>
                  <div className="text-xs text-muted-foreground">Your income is below the taxable threshold</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">$0</div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Tax Rates - Collapsible */}
        <div className="pt-3 border-t border-border">
          <button
            onClick={() => setIsTaxRatesExpanded(!isTaxRatesExpanded)}
            className="flex items-center justify-between w-full text-left hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium text-card-foreground">Tax Rates</span>
            {isTaxRatesExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {isTaxRatesExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 mt-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Tax Rate</span>
                <span className="text-sm font-medium text-card-foreground">{formatPercent(results.averageTaxRate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Marginal Tax Rate</span>
                <span className="text-sm font-medium text-card-foreground">{formatPercent(results.marginalTaxRate)}</span>
              </div>
            </motion.div>
          )}
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
          <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
            {/* Header */}
            {results.businessExpenses > 0 ? (
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="font-medium text-secondary dark:text-secondary text-sm">
                    Total Business Tax Savings
                  </div>
                  <div className="text-xs text-muted-foreground">
                    A breakdown of declared business tax expenses
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-secondary dark:text-secondary">
                    {formatCurrency(results.businessExpenses)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center">
                  <div className="font-bold text-secondary text-center dark:text-secondary text-xl">
                    Enter business expenses to reduce your tax bill
                  </div>
              </div>
            )}
            
            {/* Detailed Deduction Breakdown - Only show if there are expenses */}
            {results.businessExpenses > 0 && (
              <div className="space-y-2 pt-3 border-t border-secondary/20">
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
              </div>
            )}
          </div>
        </div>

        {/* Promotional CTA Section */}
        <div className="pt-4 p-6 bg-primary/10 border border-primary/20 rounded-lg">
          <h3 className="text-xl text-primary leading-tight mb-3 font-extrabold">          
            You could be leaving $450 – $2,670 in deductions on the table.
        </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Tallo helps you uncover every CRA-eligible business expense that lowers your tax bill.          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-start"
          >
            <a href="/deduction-finder">
              <div className="group cursor-pointer border border-border bg-card gap-2 h-[56px] sm:h-[64px] flex items-center p-[8px] sm:p-[11px] rounded-full hover:bg-card/80 transition-all duration-300">
                <div className="border border-border bg-primary h-[40px] sm:h-[43px] rounded-full flex items-center justify-center text-secondary-foreground px-4 sm:px-6">
                  <p className="font-medium tracking-tight flex items-center gap-2 sm:gap-3 justify-center text-sm sm:text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-search sm:w-5 sm:h-5"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <span className="hidden sm:inline">See missed deductions</span>
                    <span className="sm:hidden">See missed deductions</span>
                  </p>
                </div>
                <div className="text-muted-foreground group-hover:ml-2 sm:group-hover:ml-4 ease-in-out transition-all size-[20px] sm:size-[24px] flex items-center justify-center rounded-full border-2 border-border">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right group-hover:rotate-180 ease-in-out transition-all sm:w-3.5 sm:h-3.5"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </a>
          </motion.div>
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
