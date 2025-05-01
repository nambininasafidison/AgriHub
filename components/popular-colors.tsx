"use client"

import { useState } from "react"

const colors = [
  { id: "blue", color: "bg-blue-500", name: "Bleu" },
  { id: "orange", color: "bg-orange-500", name: "Orange" },
  { id: "green", color: "bg-green-500", name: "Vert" },
  { id: "red", color: "bg-red-500", name: "Rouge" },
  { id: "teal", color: "bg-teal-500", name: "Turquoise" },
]

export default function PopularColors() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Couleurs populaires</h2>
      <div className="flex gap-4">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => setSelectedColor(color.id === selectedColor ? null : color.id)}
            className={`h-10 w-10 rounded-full ${color.color} ${
              selectedColor === color.id ? "ring-2 ring-offset-2 ring-gray-400" : ""
            }`}
            aria-label={color.name}
          />
        ))}
      </div>
    </section>
  )
}
