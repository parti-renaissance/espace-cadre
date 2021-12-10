export const secondsToMinutesAndSeconds = seconds => {
  const minutes = Math.floor(seconds / 60)
  return `
		${minutes > 0 ? `${minutes} min` : ''}
		${seconds % 60 > 0 ? seconds % 60 : ''}
	`
}
