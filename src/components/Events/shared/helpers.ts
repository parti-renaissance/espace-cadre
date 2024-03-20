import { format as formatTz, utcToZonedTime } from 'date-fns-tz'

export const getFileBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })

export const formatDateTimeWithTimezone = (
  inputDate: Date | undefined,
  inputTime: Date | undefined,
  timeZone: string = 'Europe/Paris'
): string => {
  const date = inputDate ? new Date(inputDate) : new Date() // Crée une nouvelle instance basée sur inputDate ou utilise la date actuelle si null

  // Si inputTime est fourni, ajuste les heures, les minutes et les secondes de la copie de date
  if (inputTime) {
    date.setHours(inputTime.getHours(), inputTime.getMinutes(), inputTime.getSeconds())
  }

  // Convertit l'heure locale en heure UTC basée sur le fuseau horaire fourni
  const zonedTime = utcToZonedTime(date, timeZone)

  // Formatte la date et l'heure avec le fuseau horaire approprié
  const formattedDateTime = formatTz(zonedTime, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone })

  return formattedDateTime
}
