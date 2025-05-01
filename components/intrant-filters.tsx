"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const categories = [
  { id: "semences", name: "Semences" },
  { id: "engrais", name: "Engrais" },
  { id: "produits-phytosanitaires", name: "Produits phytosanitaires" },
  { id: "materiel", name: "Matériel agricole" },
  { id: "alimentation-animale", name: "Alimentation animale" },
]

const suppliers = [
  { id: "agriseed", name: "AgriSeed Madagascar" },
  { id: "fertimada", name: "FertiMada" },
  { id: "agritech", name: "AgriTech Madagascar" },
  { id: "biomada", name: "BioMada" },
  { id: "nutrimada", name: "NutriMada" },
]

export default function IntrantFilters() {
  const [priceRange, setPriceRange] = useState([0, 150000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleSupplier = (supplierId: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplierId) ? prev.filter((id) => id !== supplierId) : [...prev, supplierId],
    )
  }

  return (
    <div className="bg-white rounded-xl p-4 space-y-6">
      <div>
        <h3 className="font-medium mb-4">Filtres</h3>
        <button className="text-sm text-green-600">Réinitialiser tous les filtres</button>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "suppliers"]} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger>Catégories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Prix</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 150000]}
                max={150000}
                step={5000}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">{priceRange[0].toLocaleString()} Ar</span>
                <span className="text-sm">{priceRange[1].toLocaleString()} Ar</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="suppliers">
          <AccordionTrigger>Fournisseurs</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`supplier-${supplier.id}`}
                    checked={selectedSuppliers.includes(supplier.id)}
                    onCheckedChange={() => toggleSupplier(supplier.id)}
                  />
                  <Label
                    htmlFor={`supplier-${supplier.id}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {supplier.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger>Disponibilité</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="in-stock" />
                <Label
                  htmlFor="in-stock"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  En stock uniquement
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
