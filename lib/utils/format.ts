/**
 * Formats a number as currency in Ariary (Ar)
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString()} Ar`
}

/**
 * Formats a date string to a localized date format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Formats a file size in bytes to a human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Truncates a string to a specified length and adds ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

/**
 * Formats a phone number to a standard format
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Format for Madagascar phone numbers: 03X XX XXX XX
  const cleaned = phoneNumber.replace(/\D/g, "")

  if (cleaned.length !== 10) return phoneNumber

  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
}

/**
 * Slugifies a string (for URLs, etc.)
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}
