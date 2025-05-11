"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SimpleExpenseSplitter } from "@/components/simple-expense-splitter"
import { DetailedExpenseSplitter } from "@/components/detailed-expense-splitter"
import { ArrowLeft, Calculator, Receipt } from "lucide-react"

export function ModeSelector() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null)

  if (selectedMode === "simple") {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button variant="ghost" className="mb-4" onClick={() => setSelectedMode(null)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to modes
        </Button>
        <SimpleExpenseSplitter />
      </div>
    )
  }

  if (selectedMode === "detailed") {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button variant="ghost" className="mb-4" onClick={() => setSelectedMode(null)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to modes
        </Button>
        <DetailedExpenseSplitter />
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="bg-gradient-to-r from-rose-100 to-rose-200 pb-8">
          <CardTitle className="flex items-center text-2xl">
            <Calculator className="mr-2 h-6 w-6 text-rose-600" />
            Simple Split
          </CardTitle>
          <CardDescription>Quick and easy expense splitting based on total amounts</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600">
            Enter how much each person spent in total, and we'll calculate the minimum transactions needed to settle up.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-xs text-rose-600">
                ✓
              </span>
              Minimize number of transactions
            </li>
            <li className="flex items-center">
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-xs text-rose-600">
                ✓
              </span>
              Quick setup, instant results
            </li>
            <li className="flex items-center">
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-xs text-rose-600">
                ✓
              </span>
              Perfect for group trips or dinners
            </li>
          </ul>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 px-6 py-4">
          <Button className="w-full bg-rose-500 hover:bg-rose-600" onClick={() => setSelectedMode("simple")}>
            Choose Simple Split
          </Button>
        </CardFooter>
      </Card>

      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-100 to-teal-200 pb-8">
          <CardTitle className="flex items-center text-2xl">
            <Receipt className="mr-2 h-6 w-6 text-teal-600" />
            Detailed Split
          </CardTitle>
          <CardDescription>Item-by-item expense tracking and fair allocation</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600">
            Track each item purchased, who paid, and who consumed what for the most accurate expense splitting.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-xs text-teal-600">
                ✓
              </span>
              Item-by-item tracking
            </li>
            <li className="flex items-center">
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-xs text-teal-600">
                ✓
              </span>
              Fair allocation based on consumption
            </li>
            <li className="flex items-center">
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-xs text-teal-600">
                ✓
              </span>
              Perfect for shared households or complex expenses
            </li>
          </ul>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 px-6 py-4">
          <Button className="w-full bg-teal-500 hover:bg-teal-600" onClick={() => setSelectedMode("detailed")}>
            Choose Detailed Split
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
