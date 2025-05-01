"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Currency = "MGA" | "EUR" | "USD"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatPrice: (amount: number) => string
  exchangeRate: Record<Currency, number>
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>("MGA")

  // Exchange rates relative to MGA (Malagasy Ariary)
  // These would typically come from an API in a real application
  const exchangeRate: Record<Currency, number> = {
    MGA: 1,
    EUR: 0.00022, // 1 MGA = 0.00022 EUR
    USD: 0.00024, // 1 MGA = 0.00024 USD
  }

  useEffect(() => {
    // Load saved currency preference from localStorage
    const savedCurrency = localStorage.getItem("preferredCurrency") as Currency | null
    if (savedCurrency && Object.keys(exchangeRate).includes(savedCurrency)) {
      setCurrency(savedCurrency)
    }
  }, [])

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    localStorage.setItem("preferredCurrency", newCurrency)
  }

  const formatPrice = (amount: number) => {
    const convertedAmount = amount * exchangeRate[currency]

    const formatter = new Intl.NumberFormat(currency === "MGA" ? "fr-MG" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })

    return formatter.format(convertedAmount)
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        formatPrice,
        exchangeRate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}
