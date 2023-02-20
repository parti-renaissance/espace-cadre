import { apiClient } from 'services/networking/client'

export const uploadFile = async ({ uuid, file, endpoint }) => {
  const formData = new FormData()
  formData.append('file', file)
  return await apiClient.post(`/api/v3/${endpoint}/${uuid}/file`, formData, { 'Content-Type': 'multipart/form-data' })
}
export const getFile = async (uuid, endpoint) => {
  const response = await apiClient.request(
    'get',
    `/api/v3/${endpoint}/${uuid}/file`,
    null,
    {},
    { responseType: 'blob' },
    true
  )

  return {
    blob: new Blob([response.data], { type: response.headers.get('content-type') }),
    fileName: response.headers.has('content-disposition')
      ? response.headers.get('content-disposition').split('filename=')[1]
      : endpoint,
  }
}
