"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calculator, DollarSign } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { BarChart } from "@/components/bar-chart"
// import { PieChart } from "@/components/pie-chart"

type Person = {
  id: string
  name: string
  spent: number
}

type Transaction = {
  from: string
  to: string
  amount: number
}

type SimpleExpenseResultsProps = {
  people: Person[]
  onBack: () => void
}

export function SimpleExpenseResults({ people, onBack }: SimpleExpenseResultsProps) {
  // Calculate the total spent and the average per person
  const totalSpent = Array.isArray(people) ? people.reduce((sum, person) => sum + (person?.spent || 0), 0) : 0
  const averagePerPerson = Array.isArray(people) && people.length > 0 ? totalSpent / people.length : 0

  // Calculate how much each person owes or is owed
  const balances = Array.isArray(people)
    ? people.map((person) => ({
      id: person?.id || "",
      name: person?.name || "Unknown",
      spent: person?.spent || 0,
      balance: (person?.spent || 0) - averagePerPerson,
    }))
    : []

  // Sort balances from most negative (owes money) to most positive (is owed)
  const sortedBalances = [...balances].sort((a, b) => a.balance - b.balance)

  // Calculate the minimum transactions needed
  const transactions: Transaction[] = []

  let i = 0 // index for people who owe money (negative balance)
  let j = sortedBalances.length - 1 // index for people who are owed money (positive balance)

  while (i < j) {
    const debtor = sortedBalances[i]
    const creditor = sortedBalances[j]

    // Skip people with zero balance
    if (Math.abs(debtor.balance) < 0.01) {
      i++
      continue
    }
    if (Math.abs(creditor.balance) < 0.01) {
      j--
      continue
    }

    // Calculate the transaction amount
    const amount = Math.min(Math.abs(debtor.balance), creditor.balance)

    if (amount > 0) {
      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: Number.parseFloat(amount.toFixed(2)),
      })

      // Update balances
      debtor.balance += amount
      creditor.balance -= amount
    }

    // Move to the next person if their balance is settled
    if (Math.abs(debtor.balance) < 0.01) i++
    if (Math.abs(creditor.balance) < 0.01) j--
  }

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="bg-gradient-to-r from-rose-100 to-rose-200">
        <CardTitle className="flex items-center text-2xl">
          <Calculator className="mr-2 h-6 w-6 text-rose-600" />
          Expense Split Results
        </CardTitle>
        <CardDescription>Here's how to settle up with minimum transactions</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Each Person's Share</p>
              <p className="text-2xl font-bold text-gray-900">${averagePerPerson.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-medium">Required Payments</h3>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                        <DollarSign className="h-5 w-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.from}</p>
                        <p className="text-sm text-gray-500">pays</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold">${transaction.amount.toFixed(2)}</div>
                    <div className="flex items-center">
                      <div>
                        <p className="font-medium text-right">{transaction.to}</p>
                        <p className="text-sm text-gray-500 text-right">receives</p>
                      </div>
                      <div className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-gray-500">Everyone is already even! No payments needed.</p>
              </div>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-4 text-lg font-medium">Spending Analysis</h3>

            {/* <Tabs defaultValue="table">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                <TabsTrigger value="pie">Pie Chart</TabsTrigger>
              </TabsList> */}

            {/* <TabsContent value="table" className="space-y-3"> */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Person</th>
                    <th className="text-right py-2">Amount Spent</th>
                    <th className="text-right py-2">Contribution %</th>
                    {/* <th className="text-right py-2">Status</th> */}
                  </tr>
                </thead>
                <tbody>
                  {balances.map((person) => {
                    const contributionPercent = totalSpent > 0 ? (person.spent / totalSpent) * 100 : 0

                    return (
                      <tr key={person.id} className="border-b">
                        <td className="py-2">{person.name}</td>
                        <td className="text-right py-2">${person.spent.toFixed(2)}</td>
                        <td className="text-right py-2">{contributionPercent.toFixed(1)}%</td>
                        {/* <td className="text-right py-2">
                          <span
                            className={
                              person.balance > 0
                                ? "font-medium text-green-600"
                                : person.balance < 0
                                  ? "font-medium text-rose-600"
                                  : ""
                            }
                          >
                            {person.balance > 0
                              ? `Gets back $${person.balance.toFixed(2)}`
                              : person.balance < 0
                                ? `Owes $${Math.abs(person.balance).toFixed(2)}`
                                : "Even"}
                          </span>
                        </td> */}
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100">
                    <td className="py-2 font-medium">Total</td>
                    <td className="text-right py-2 font-medium">${totalSpent.toFixed(2)}</td>
                    <td className="text-right py-2 font-medium">100%</td>
                    <td className="text-right py-2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="rounded-lg bg-white p-3 border">
                <p className="text-sm text-gray-500">Group Average</p>
                <p className="text-xl font-bold text-gray-900">${averagePerPerson.toFixed(2)}</p>
              </div>
              <div className="rounded-lg bg-white p-3 border">
                <p className="text-sm text-gray-500">Highest Contribution</p>
                <p className="text-xl font-bold text-gray-900">
                  $
                  {Array.isArray(people) && people.length > 0
                    ? Math.max(...people.map((p) => p?.spent || 0)).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
            {/* </TabsContent> */}

            {/* <TabsContent value="bar">
                <div className="h-80">
                  <BarChart data={people} />
                </div>
              </TabsContent>

              <TabsContent value="pie">
                <div className="h-80">
                  <PieChart data={people} totalSpent={totalSpent} />
                </div>
              </TabsContent> */}
            {/* </Tabs> */}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 px-6 py-4">
        <Button variant="outline" onClick={onBack} className="w-full">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Expense Entry
        </Button>
      </CardFooter>
    </Card>
  )
}
