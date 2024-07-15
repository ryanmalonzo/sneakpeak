const convertToCSV = (data: Record<string, unknown>[]): string => {
  // Function to escape and quote a value if necessary
  const escapeValue = (value: any): string => {
    if (typeof value === 'string') {
      // Escape double quotes and wrap in quotes if contains comma or newline
      value = value.replace(/"/g, '""')
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        return `"${value}"`
      }
    } else if (typeof value === 'object' && value !== null) {
      // Convert objects to JSON strings
      return `"${JSON.stringify(value).replace(/"/g, '""')}"`
    }
    return String(value)
  }

  // Get all unique keys from all objects
  const allKeys = Array.from(new Set(data.flatMap((obj) => Object.keys(obj))))

  // Create header row
  const headerRow = allKeys.map(escapeValue).join(',')

  // Create data rows
  const dataRows = data.map((obj) => allKeys.map((key) => escapeValue(obj[key] ?? '')).join(','))

  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n')
}

export const downloadCSV = (data: Record<string, unknown>[], filename: string): void => {
  const csvContent = convertToCSV(data)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
