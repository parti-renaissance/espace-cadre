import { saveAs } from 'file-saver'
import { apiClient } from '~/services/networking/client'

export const uploadFile = async ({ uuid, file, endpoint }) => {
  const formData = new FormData()
  formData.append('file', file)
  return await apiClient.post(`/api/v3/${endpoint}/${uuid}/file`, formData, { 'Content-Type': 'multipart/form-data' })
}

export const downloadFile = async (endpoint, filename = null) => {
  const response = await apiClient.request('get', endpoint, null, {}, { responseType: 'blob' }, true)

  const fileName = response.headers.has('content-disposition')
    ? response.headers.get('content-disposition').split('filename=')[1].replace(/"/g, '')
    : endpoint

  saveAs(new Blob([response.data], { type: response.headers.get('content-type') }), filename ?? fileName)

  return fileName
}
