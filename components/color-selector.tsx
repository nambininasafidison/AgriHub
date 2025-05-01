"use client"

import { useState } from "react"

const colors = [
  { id: "blue", color: "bg-blue-500", hoverColor: "hover:bg-blue-600" },
  { id: "orange", color: "bg-orange-500", hoverColor: "hover:bg-orange-600" },
  { id: "green", color: "bg-green-500", hoverColor: "hover:bg-green-600" },
  { id: "red", color: "bg-red-500", hoverColor: "hover:bg-red-600" },
  { id: "teal", color: "bg-teal-500", hoverColor: "hover:bg-teal-600" },
]

export default function ColorSelector() {
  const [selectedColor, setSelectedColor] = useState<string | null>("blue")

  return (
    <div className="flex space-x-4">
      {colors.map((color) => (
        <button
          key={color.id}
          onClick={() => setSelectedColor(color.id)}
          className={`w-8 h-8 rounded-full ${color.color} ${color.hoverColor} transition-all duration-200 ${
            selectedColor === color.id ? "ring-2 ring-offset-2 ring-gray-300" : ""
          }`}
          aria-label={`Select ${color.id} color`}
        />
      ))}
    </div>
  )
}
