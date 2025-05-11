"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2, Users, Receipt, ArrowRight, ArrowLeft } from "lucide-react"
import { DetailedExpenseResults } from "@/components/detailed-expense-results"
import { Checkbox } from "@/components/ui/checkbox"

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

export function DetailedExpenseSplitter() {
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "Person 1" },
    { id: "2", name: "Person 2" },
  ])

  const [items, setItems] = useState<Item[]>([
    {
      id: "1",
      name: "Item 1",
      cost: 0,
      paidBy: "1",
      consumedBy: { "1": true, "2": true },
    },
  ])

  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState("people")

  const addPerson = () => {
    const newPerson = {
      id: Date.now().toString(),
      name: `Person ${people.length + 1}`,
    }

    setPeople([...people, newPerson])

    // Update all items to include this person in consumedBy
    setItems(
      items.map((item) => ({
        ...item,
        consumedBy: {
          ...item.consumedBy,
          [newPerson.id]: false,
        },
      })),
    )
  }

  const removePerson = (id: string) => {
    if (people.length <= 2) return

    setPeople(people.filter((person) => person.id !== id))

    // Update items to remove this person from consumedBy and change paidBy if needed
    setItems(
      items.map((item) => {
        const newItem = { ...item }

        // Remove from consumedBy
        const { [id]: removed, ...restConsumed } = newItem.consumedBy
        newItem.consumedBy = restConsumed

        // Change paidBy if this person was paying
        if (newItem.paidBy === id) {
          newItem.paidBy = people[0].id !== id ? people[0].id : people[1].id
        }

        return newItem
      }),
    )
  }

  const updatePerson = (id: string, name: string) => {
    setPeople(
      people.map((person) => {
        if (person.id === id) {
          return { ...person, name }
        }
        return person
      }),
    )
  }

  const addItem = () => {
    // Create consumedBy object with all people set to false by default
    const consumedBy: Record<string, boolean> = {}
    people.forEach((person) => {
      consumedBy[person.id] = true
    })

    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: `Item ${items.length + 1}`,
        cost: 0,
        paidBy: people[0].id,
        consumedBy,
      },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length <= 1) return
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof Item, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          if (field === "consumedBy") {
            // Handle the special case for consumedBy which is an object
            return {
              ...item,
              consumedBy: {
                ...item.consumedBy,
                ...value,
              },
            }
          }
          return { ...item, [field]: value }
        }
        return item
      }),
    )
  }

  const togglePersonConsumed = (itemId: string, personId: string) => {
    const item = items.find((i) => i.id === itemId)
    if (!item) return

    updateItem(itemId, "consumedBy", {
      [personId]: !item.consumedBy[personId],
    })
  }

  const calculateSplit = () => {
    setShowResults(true)
  }

  if (showResults) {
    return <DetailedExpenseResults people={people} items={items} onBack={() => setShowResults(false)} />
  }

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="bg-gradient-to-r from-teal-100 to-teal-200">
        <CardTitle className="flex items-center text-2xl">
          <Receipt className="mr-2 h-6 w-6 text-teal-600" />
          Detailed Expense Splitting
        </CardTitle>
        <CardDescription>Track each item, who paid, and who consumed what</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="people" className="text-sm">
              <Users className="mr-2 h-4 w-4" />
              People
            </TabsTrigger>
            <TabsTrigger value="items" className="text-sm">
              <Receipt className="mr-2 h-4 w-4" />
              Items
            </TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="space-y-4">
            {people.map((person, index) => (
              <div key={person.id} className="flex items-end gap-3">
                <div className="flex-1">
                  <Label htmlFor={`name-${person.id}`}>Name</Label>
                  <Input
                    id={`name-${person.id}`}
                    value={person.name}
                    onChange={(e) => updatePerson(person.id, e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePerson(person.id)}
                  disabled={people.length <= 2}
                  className="mb-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}

            <Button variant="outline" onClick={addPerson} className="w-full mt-2">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Person
            </Button>

            <div className="pt-4">
              <Button onClick={() => setActiveTab("items")} className="w-full bg-teal-500 hover:bg-teal-600">
                Next: Add Items <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            {items.map((item, index) => (
              <div key={item.id} className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Item {index + 1}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length <= 1}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`item-name-${item.id}`}>Item Name</Label>
                    <Input
                      id={`item-name-${item.id}`}
                      value={item.name}
                      onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`item-cost-${item.id}`}>Cost ($)</Label>
                    <Input
                      id={`item-cost-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.cost || ""}
                      onChange={(e) => updateItem(item.id, "cost", Number.parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`item-paidby-${item.id}`}>Paid By</Label>
                  <select
                    id={`item-paidby-${item.id}`}
                    value={item.paidBy}
                    onChange={(e) => updateItem(item.id, "paidBy", e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {people.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="mb-2 block">Consumed By</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {people.map((person) => (
                      <div key={person.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`consumed-${item.id}-${person.id}`}
                          checked={item.consumedBy[person.id] || false}
                          onCheckedChange={() => togglePersonConsumed(item.id, person.id)}
                        />
                        <Label htmlFor={`consumed-${item.id}-${person.id}`} className="text-sm font-normal">
                          {person.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={addItem} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Item
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 px-6 py-4 flex justify-between">
        {activeTab === "items" && (
          <Button variant="outline" onClick={() => setActiveTab("people")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to People
          </Button>
        )}
        <div className={activeTab === "people" ? "hidden" : "block ml-auto"}>
          <Button onClick={calculateSplit} className="bg-teal-500 hover:bg-teal-600">
            Calculate Split <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
