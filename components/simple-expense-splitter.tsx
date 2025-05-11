"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Users, ArrowRight } from "lucide-react"
import { SimpleExpenseResults } from "@/components/simple-expense-results"

type Person = {
  id: string
  name: string
  spent: number
}

export function SimpleExpenseSplitter() {
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "Person 1", spent: 0 },
    { id: "2", name: "Person 2", spent: 0 },
  ])
  const [showResults, setShowResults] = useState(false)

  const addPerson = () => {
    setPeople([...people, { id: Date.now().toString(), name: `Person ${people.length + 1}`, spent: 0 }])
  }

  const removePerson = (id: string) => {
    if (people.length <= 2) return
    setPeople(people.filter((person) => person.id !== id))
  }

  const updatePerson = (id: string, field: keyof Person, value: string | number) => {
    setPeople(
      people.map((person) => {
        if (person.id === id) {
          return { ...person, [field]: value }
        }
        return person
      }),
    )
  }

  const calculateSplit = () => {
    // Validate people data before showing results
    if (people.some((person) => person.name.trim() === "")) {
      // Handle validation error - could show an error message
      alert("Please enter names for all people")
      return
    }

    setShowResults(true)
  }

  if (showResults) {
    // Ensure we're passing a valid array
    return (
      <SimpleExpenseResults
        people={people.map((p) => ({ ...p, spent: Number(p.spent) || 0 }))}
        onBack={() => setShowResults(false)}
      />
    )
  }

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="bg-gradient-to-r from-rose-100 to-rose-200">
        <CardTitle className="flex items-center text-2xl">
          <Users className="mr-2 h-6 w-6 text-rose-600" />
          Simple Expense Splitting
        </CardTitle>
        <CardDescription>Enter how much each person spent in total</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {people.map((person, index) => (
            <div key={person.id} className="flex items-end gap-3">
              <div className="flex-1">
                <Label htmlFor={`name-${person.id}`}>Name</Label>
                <Input
                  id={`name-${person.id}`}
                  value={person.name}
                  onChange={(e) => updatePerson(person.id, "name", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`spent-${person.id}`}>Amount Spent ($)</Label>
                <Input
                  id={`spent-${person.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={person.spent || ""}
                  onChange={(e) => updatePerson(person.id, "spent", Number.parseFloat(e.target.value) || 0)}
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
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 px-6 py-4 flex justify-end">
        <Button onClick={calculateSplit} className="bg-rose-500 hover:bg-rose-600">
          Calculate Split <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
