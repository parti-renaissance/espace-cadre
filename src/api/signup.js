import { apiClientPublic } from '~/services/networking/client'

export const signupQuery = values => {
  const { email, firstName, lastName, gender, birthdate, phone, address, cgu, mobileNotification, emailNotification } =
    values

  const body = {
    email_address: email,
    first_name: firstName,
    last_name: lastName,
    gender: gender,
    birthdate: `${birthdate.year}-${birthdate.month}-${birthdate.day}`,
    phone: phone || null,
    address: {
      address: [address.number, address.number && ' ', address.route].filter(Boolean).join(''),
      postal_code: address.postalCode,
      city_name: address.locality,
      country: address.country,
    },
    cgu_accepted: cgu,
    allow_mobile_notifications: mobileNotification,
    allow_email_notifications: emailNotification,
  }

  return apiClientPublic('post', 'api/membership?source=jemengage', body)
}
