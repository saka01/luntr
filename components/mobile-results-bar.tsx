"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { TaxData } from "./tax-calculator"
import { calculateTax } from "@/lib/tax-calculations"

type Props = {
  taxData: TaxData
  onViewResults: () => void
  show: boolean
  onClose: () => void
}

export function MobileResultsBar({ taxData, onViewResults, show, onClose }: Props) {
  const results = calculateTax(taxData)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (!taxData.province) return null

  return (
    <>
      {/* Sticky Bottom Bar - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Estimated Tax</p>
            <p className="text-lg ">{formatCurrency(results.totalTax)}</p>
          </div>
          <Button onClick={onViewResults} className="bg-primary text-primary-foreground">
            View Results
          </Button>
        </div>
      </div>

      {/* Results Sheet - Mobile Only */}
      <Sheet open={show} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Tax Summary</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <h3 className=" text-lg">Income Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Income</span>
                  <span className="">{formatCurrency(results.totalIncome)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Deductions</span>
                  <span className=" text-accent">−{formatCurrency(results.totalDeductions)}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between">
                  <span className="">Taxable Income</span>
                  <span className="">{formatCurrency(results.taxableIncome)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className=" text-lg">Tax Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Federal Tax</span>
                  <span className="">{formatCurrency(results.federalTax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Provincial Tax</span>
                  <span className="">{formatCurrency(results.provincialTax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CPP Contributions</span>
                  <span className="">{formatCurrency(results.cppContributions)}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between">
                  <span className="">Total Tax Owing</span>
                  <span className=" text-lg">{formatCurrency(results.totalTax)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">After-Tax Income</span>
                <span className="text-2xl  text-accent">{formatCurrency(results.afterTaxIncome)}</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
