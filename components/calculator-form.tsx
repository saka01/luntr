"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, HelpCircle } from "lucide-react"
import { useState } from "react"
import type { TaxData } from "./tax-calculator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Props = {
  taxData: TaxData
  setTaxData: (data: TaxData) => void
}

export function CalculatorForm({ taxData, setTaxData }: Props) {
  const [showEmploymentIncome, setShowEmploymentIncome] = useState(false)
  const [showOtherIncome, setShowOtherIncome] = useState(false)
  const [showDeductions, setShowDeductions] = useState(false)

  const updateField = (field: keyof TaxData, value: string | number) => {
    setTaxData({ ...taxData, [field]: value })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Province Selection */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Province / Territory</CardTitle>
          <CardDescription>Select your province to calculate accurate tax rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="province">Province *</Label>
            <Select value={taxData.province} onValueChange={(value) => updateField("province", value)}>
              <SelectTrigger id="province">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ON">Ontario</SelectItem>
                <SelectItem value="BC">British Columbia</SelectItem>
                <SelectItem value="AB">Alberta</SelectItem>
                <SelectItem value="QC">Quebec</SelectItem>
                <SelectItem value="MB">Manitoba</SelectItem>
                <SelectItem value="SK">Saskatchewan</SelectItem>
                <SelectItem value="NS">Nova Scotia</SelectItem>
                <SelectItem value="NB">New Brunswick</SelectItem>
                <SelectItem value="PE">Prince Edward Island</SelectItem>
                <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                <SelectItem value="YT">Yukon</SelectItem>
                <SelectItem value="NT">Northwest Territories</SelectItem>
                <SelectItem value="NU">Nunavut</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Income Inputs */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Income</CardTitle>
          <CardDescription>Enter all sources of income for the tax year</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="selfEmploymentIncome">Self-Employment Income *</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Total revenue from your business or freelance work before expenses</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="selfEmploymentIncome"
              type="number"
              placeholder="$0"
              value={taxData.selfEmploymentIncome || ""}
              onChange={(e) => updateField("selfEmploymentIncome", Number.parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmploymentIncome(!showEmploymentIncome)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {showEmploymentIncome ? "− Hide" : "+ Add"} Employment Income
            </Button>
          </div>

          {showEmploymentIncome && (
            <div className="space-y-2 pl-4 border-l-2 border-muted">
              <Label htmlFor="employmentIncome">Employment Income (T4)</Label>
              <Input
                id="employmentIncome"
                type="number"
                placeholder="$0"
                value={taxData.employmentIncome || ""}
                onChange={(e) => updateField("employmentIncome", Number.parseFloat(e.target.value) || 0)}
              />
            </div>
          )}

          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOtherIncome(!showOtherIncome)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {showOtherIncome ? "− Hide" : "+ Add"} Other Income
            </Button>
          </div>

          {showOtherIncome && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              <div className="space-y-2">
                <Label htmlFor="capitalGains">Capital Gains</Label>
                <Input
                  id="capitalGains"
                  type="number"
                  placeholder="$0"
                  value={taxData.capitalGains || ""}
                  onChange={(e) => updateField("capitalGains", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eligibleDividends">Eligible Dividends</Label>
                <Input
                  id="eligibleDividends"
                  type="number"
                  placeholder="$0"
                  value={taxData.eligibleDividends || ""}
                  onChange={(e) => updateField("eligibleDividends", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ineligibleDividends">Ineligible Dividends</Label>
                <Input
                  id="ineligibleDividends"
                  type="number"
                  placeholder="$0"
                  value={taxData.ineligibleDividends || ""}
                  onChange={(e) => updateField("ineligibleDividends", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherIncome">Other Income</Label>
                <Input
                  id="otherIncome"
                  type="number"
                  placeholder="$0"
                  value={taxData.otherIncome || ""}
                  onChange={(e) => updateField("otherIncome", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Deductions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Business Deductions (T2125)</CardTitle>
          <CardDescription>Common expenses for freelancers and self-employed individuals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Collapsible open={showDeductions} onOpenChange={setShowDeductions}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal">
                <span className="text-sm text-muted-foreground">
                  {showDeductions ? "Hide" : "Show"} expense categories
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showDeductions ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="vehicleExpense">Vehicle Expenses</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Gas, insurance, maintenance, and lease/loan payments for business use</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="vehicleExpense"
                    type="number"
                    placeholder="$0"
                    value={taxData.vehicleExpense || ""}
                    onChange={(e) => updateField("vehicleExpense", Number.parseFloat(e.target.value) || 0)}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="vehicleBusinessUse">Business Use %</Label>
                    <Input
                      id="vehicleBusinessUse"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="100"
                      value={taxData.vehicleBusinessUse || ""}
                      onChange={(e) => updateField("vehicleBusinessUse", Number.parseFloat(e.target.value) || 100)}
                    />
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="homeOfficeExpense">Home Office Expenses</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Rent, utilities, internet, and property taxes for your home office space</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="homeOfficeExpense"
                    type="number"
                    placeholder="$0"
                    value={taxData.homeOfficeExpense || ""}
                    onChange={(e) => updateField("homeOfficeExpense", Number.parseFloat(e.target.value) || 0)}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="homeOfficeBusinessUse">Business Use %</Label>
                    <Input
                      id="homeOfficeBusinessUse"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="100"
                      value={taxData.homeOfficeBusinessUse || ""}
                      onChange={(e) => updateField("homeOfficeBusinessUse", Number.parseFloat(e.target.value) || 100)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="mealsExpense">Meals & Entertainment</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Business meals (automatically limited to 50% deduction by CRA)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="mealsExpense"
                    type="number"
                    placeholder="$0"
                    value={taxData.mealsExpense || ""}
                    onChange={(e) => updateField("mealsExpense", Number.parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">50% deduction applied automatically</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advertisingExpense">Advertising & Marketing</Label>
                  <Input
                    id="advertisingExpense"
                    type="number"
                    placeholder="$0"
                    value={taxData.advertisingExpense || ""}
                    onChange={(e) => updateField("advertisingExpense", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="softwareExpense">Software & Subscriptions</Label>
                  <Input
                    id="softwareExpense"
                    type="number"
                    placeholder="$0"
                    value={taxData.softwareExpense || ""}
                    onChange={(e) => updateField("softwareExpense", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelExpense">Travel Expenses</Label>
                  <Input
                    id="travelExpense"
                    type="number"
                    placeholder="$0"
                    value={taxData.travelExpense || ""}
                    onChange={(e) => updateField("travelExpense", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalFeesExpense">Professional Fees</Label>
                  <Input
                    id="professionalFeesExpense"
                    type="number"
                    placeholder="$0"
                    value={taxData.professionalFeesExpense || ""}
                    onChange={(e) => updateField("professionalFeesExpense", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* RRSP & FHSA */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">RRSP & FHSA Contributions</CardTitle>
          <CardDescription>Reduce your taxable income with registered savings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="rrspContribution">RRSP Contribution</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Registered Retirement Savings Plan contributions reduce taxable income</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="rrspContribution"
              type="number"
              placeholder="$0"
              value={taxData.rrspContribution || ""}
              onChange={(e) => updateField("rrspContribution", Number.parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="fhsaContribution">FHSA Contribution</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>First Home Savings Account contributions (up to $8,000/year)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="fhsaContribution"
              type="number"
              placeholder="$0"
              value={taxData.fhsaContribution || ""}
              onChange={(e) => updateField("fhsaContribution", Number.parseFloat(e.target.value) || 0)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Taxes Paid */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Taxes Already Paid</CardTitle>
          <CardDescription>Income tax deducted at source or installments paid</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="taxesPaid">Income Tax Paid</Label>
            <Input
              id="taxesPaid"
              type="number"
              placeholder="$0"
              value={taxData.taxesPaid || ""}
              onChange={(e) => updateField("taxesPaid", Number.parseFloat(e.target.value) || 0)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
