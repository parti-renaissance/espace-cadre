import { format } from 'date-fns'

export const getFileBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })

export const joinDateTime = (inputDate: Date | undefined, inputTime: Date | undefined): string => {
  const date = inputDate ? new Date(inputDate) : new Date() // Crée une nouvelle instance basée sur inputDate ou utilise la date actuelle si null

  if (inputTime) {
    date.setHours(inputTime.getHours(), inputTime.getMinutes(), inputTime.getSeconds())
  }

  return format(date, "yyyy-MM-dd'T'HH:mm:ss")
}
