"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { addAddress } from "@/lib/actions/auth"
import { useNotification } from "@/components/notification-provider"

// List of regions in Madagascar
const regions = [
  "Analamanga",
  "Vakinankaratra",
  "Itasy",
  "Bongolava",
  "Haute Matsiatra",
  "Amoron'i Mania",
  "Vatovavy",
  "Fitovinany",
  "Atsimo-Atsinanana",
  "Analanjirofo",
  "Diana",
  "Sava",
  "Menabe",
]

interface AddressFormProps {
  initialValues?: {
    name: string
    address: string
    city: string
    region: string
    phone: string
  }
  onChange?: (values: any) => void
  showSaveOption?: boolean
  onSubmit?: (values: any) => void
}

export default function AddressForm({
  initialValues = { name: "", address: "", city: "", region: "", phone: "" },
  onChange,
  showSaveOption = false,
  onSubmit,
}: AddressFormProps) {
  const [values, setValues] = useState(initialValues)
  const [saveAddress, setSaveAddress] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addNotification } = useNotification()

  const handleChange = (field: string, value: string) => {
    const newValues = { ...values, [field]: value }
    setValues(newValues)
    if (onChange) onChange(newValues)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (onSubmit) {
      onSubmit(values)
      return
    }

    if (saveAddress) {
      setIsSubmitting(true)

      try {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("street", values.address)
        formData.append("city", values.city)
        formData.append("region", values.region)
        formData.append("country", "Madagascar")
        formData.append("phone", values.phone)
        formData.append("isDefault", "false")

        const result = await addAddress(formData)

        if (result.error) {
          addNotification({
            title: "Erreur",
            message: result.error,
            type: "error",
          })
        } else {
          addNotification({
            title: "Adresse enregistrée",
            message: "Votre adresse a été enregistrée avec succès",
            type: "success",
          })
        }
      } catch (error) {
        addNotification({
          title: "Erreur",
          message: "Une erreur est survenue lors de l'enregistrement de l'adresse",
          type: "error",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input
          type="text"
          id="name"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          type="text"
          id="address"
          value={values.address}
          onChange={(e) => handleChange("address", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            type="text"
            id="city"
            value={values.city}
            onChange={(e) => handleChange("city", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Région</Label>
          <Select value={values.region} onValueChange={(value) => handleChange("region", value)} required>
            <SelectTrigger id="region">
              <SelectValue placeholder="Sélectionnez une région" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          type="tel"
          id="phone"
          value={values.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="03X XX XXX XX"
          required
        />
      </div>

      {showSaveOption && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="save-address"
            checked={saveAddress}
            onCheckedChange={(checked) => setSaveAddress(checked === true)}
          />
          <Label htmlFor="save-address" className="text-sm cursor-pointer">
            Enregistrer cette adresse pour mes prochaines commandes
          </Label>
        </div>
      )}

      {onSubmit && (
        <button type="submit" className="w-full py-2 px-4 bg-primary text-white rounded-md" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer l'adresse"}
        </button>
      )}
    </form>
  )
}
