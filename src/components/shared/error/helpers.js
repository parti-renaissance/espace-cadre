import { notifyMessages, notifyVariants } from '~/components/shared/notification/constants'
import { validationMessages } from '~/components/shared/error/constants'

export const handleGenericHttpErrors = (cb, status, stack, message) => {
  if (typeof cb !== 'function') {
    return
  }
  if (!status || [500, 405].includes(status)) {
    return cb(notifyMessages.errorTitle, notifyVariants.error, stack || message || notifyMessages.errorDetail)
  }
  if (status === 404) {
    return cb(notifyMessages.notFoundTitle, notifyVariants.error, notifyMessages.notFoundDetail)
  }
  if (status === 400) {
    return cb(notifyMessages.badRequestTitle, notifyVariants.error, message)
  }
  if (status === 403) {
    return cb(notifyMessages.unauthorizedTitle, notifyVariants.error, notifyMessages.unauthorizedDetail)
  }
}

const transformViolationToErrorMessage = ({ propertyPath: field, message, title }) => ({
  field,
  message: message || title,
})
export const getFormattedErrorMessages = data => {
  const { violations = [] } = data || {}
  if (violations.length > 0) {
    return violations.map(transformViolationToErrorMessage)
  }
  return [{ field: 'name', message: validationMessages.mainError }]
}
