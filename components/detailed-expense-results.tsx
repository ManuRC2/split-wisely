"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calculator, DollarSign } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Person = {
  id: string
  name: string
}

type Item = {
  id: string
  name: string
  cost: number
  paidBy: string
  consumedBy: Record<string, boolean>
}

type Transaction = {
  from: string
  to: string
  amount: number
}

type DetailedExpenseResultsProps = {
  people: Person[]
  items: Item[]
  onBack: () => void
}

export function DetailedExpenseResults({ people, items, onBack }: DetailedExpenseResultsProps) {
  // Calculate how much each person paid
  const personPaid: Record<string, number> = {}
  people.forEach((person) => {
    personPaid[person.id] = 0
  })

  items.forEach((item) => {
    personPaid[item.paidBy] = (personPaid[item.paidBy] || 0) + item.cost
  })

  // Calculate how much each person owes
  const personOwes: Record<string, number> = {}
  people.forEach((person) => {
    personOwes[person.id] = 0
  })

  items.forEach((item) => {
    // Count how many people consumed this item
    const consumersCount = Object.values(item.consumedBy).filter(Boolean).length

    if (consumersCount === 0) return // Skip if no one consumed it

    // Calculate cost per person for this item
    const costPerPerson = item.cost / consumersCount

    // Add to what each person owes
    Object.entries(item.consumedBy).forEach(([personId, consumed]) => {
      if (consumed) {
        personOwes[personId] = (personOwes[personId] || 0) + costPerPerson
      }
    })
  })

  // Calculate net balance for each person (paid - owes)
  const balances = people.map((person) => ({
    id: person.id,
    name: person.name,
    paid: personPaid[person.id] || 0,
    owes: personOwes[person.id] || 0,
    balance: (personPaid[person.id] || 0) - (personOwes[person.id] || 0),
  }))

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

  // Calculate total spent
  const totalSpent = items.reduce((sum, item) => sum + item.cost, 0)

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="bg-gradient-to-r from-teal-100 to-teal-200">
        <CardTitle className="flex items-center text-2xl">
          <Calculator className="mr-2 h-6 w-6 text-teal-600" />
          Detailed Expense Results
        </CardTitle>
        <CardDescription>Here's the breakdown of expenses and payments</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Number of Items</p>
                <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-3 text-lg font-medium">Individual Summaries</h3>
              <div className="space-y-4">
                {balances.map((person) => (
                  <div key={person.id} className="rounded-lg bg-gray-50 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{person.name}</h4>
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
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Paid:</span> ${person.paid.toFixed(2)}
                      </div>
                      <div>
                        <span className="text-gray-500">Owes:</span> ${person.owes.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            <h3 className="mb-3 text-lg font-medium">Item Breakdown</h3>
            <div className="space-y-3">
              {items.map((item) => {
                const paidByPerson = people.find((p) => p.id === item.paidBy)
                const consumedByPeople = people.filter((p) => item.consumedBy[p.id])
                const consumersCount = consumedByPeople.length
                const costPerPerson = consumersCount > 0 ? item.cost / consumersCount : 0

                return (
                  <div key={item.id} className="rounded-lg border p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{item.name}</h4>
                      <span className="font-medium">${item.cost.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Paid by: <span className="font-medium">{paidByPerson?.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Consumed by:</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {consumedByPeople.length > 0 ? (
                          consumedByPeople.map((person) => (
                            <span
                              key={person.id}
                              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs"
                            >
                              {person.name} (${costPerPerson.toFixed(2)})
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">No one</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 px-6 py-4">
        <Button variant="outline" onClick={onBack} className="w-full">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Expense Entry
        </Button>
      </CardFooter>
    </Card>
  )
}
