"use server"

import type { Currency } from "../types"

// Mock data for currencies
const currencies: Currency[] = [
  {
    code: "MGA",
    name: "Ariary malgache",
    symbol: "Ar",
    exchangeRate: 1,
    isDefault: true,
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    exchangeRate: 0.00022,
    isDefault: false,
  },
  {
    code: "USD",
    name: "Dollar américain",
    symbol: "$",
    exchangeRate: 0.00024,
    isDefault: false,
  },
]

export async function getCurrencies() {
  return currencies
}

export async function getDefaultCurrency() {
  return currencies.find((c) => c.isDefault) || currencies[0]
}

export async function getCurrencyByCode(code: string) {
  return currencies.find((c) => c.code === code) || null
}

export async function convertPrice(price: number, fromCurrency: string, toCurrency: string) {
  const from = await getCurrencyByCode(fromCurrency)
  const to = await getCurrencyByCode(toCurrency)

  if (!from || !to) {
    throw new Error("Currency not found")
  }

  // Convert to base currency first, then to target currency
  const inBaseCurrency = price / from.exchangeRate
  return inBaseCurrency * to.exchangeRate
}

export function formatPrice(price: number, currencyCode: string) {
  const currency = currencies.find((c) => c.code === currencyCode)

  if (!currency) {
    return `${price.toLocaleString()} ???`
  }

  if (currencyCode === "MGA") {
    return `${price.toLocaleString()} ${currency.symbol}`
  }

  return `${currency.symbol}${price.toLocaleString()}`
}
