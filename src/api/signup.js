import { apiClientPublic } from 'services/networking/client'

export const signupQuery = values => {
  const data = {
    email_address: values.email,
    first_name: values.firstName,
    last_name: values.lastName,
    gender: values.gender,
    birthdate: `${values.birthdate.year}-${values.birthdate.month}-${values.birthdate.day}`,
    phone: values.phone || null,
    address: {
      address: [values.address.number, values.address.number && ' ', values.address.route].filter(Boolean).join(''),
      postal_code: values.address.postalCode,
      city_name: values.address.locality,
      country: values.address.country,
    },
    cgu_accepted: values.cgu,
    allow_mobile_notifications: values.mobileNotification,
    allow_email_notifications: values.emailNotification,
  }

  return apiClientPublic('post', 'api/membership?source=jemengage', data)
}
