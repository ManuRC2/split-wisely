import { ModeSelector } from "@/components/mode-selector"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-teal-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Split<span className="text-rose-500">Wisely</span>
          </h1>
          <p className="mt-3 text-lg text-gray-600">Split expenses with friends, hassle-free</p>
        </div>

        <ModeSelector />
      </div>
    </main>
  )
}
