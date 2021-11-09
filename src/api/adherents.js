import { apiClient } from 'services/networking/client'
import qs from 'qs'
import Adherent from 'domain/adherent'

export const adherentAutocompleteUri = '/api/v3/adherents/autocomplete'
export const getAdherents = async (filter, cb) => {
  const data = await apiClient.get(`v3/adherents?${qs.stringify(filter)}`)
  const adherents = data.items.map(
    a =>
      new Adherent(
        a.first_name,
        a.last_name,
        a.gender,
        a.country,
        a.region_code,
        a.region,
        a.department_code,
        a.department,
        a.city_code,
        a.city,
        a.postal_code,
        a.interests,
        a.email_subscription,
        a.sms_subscription
      )
  )

  cb && cb(adherents)
  return adherents
}
export const getColumns = async cb => {
  const columns = await apiClient.get('v3/adherents/columns')
  cb && cb(columns)
  return columns
}
