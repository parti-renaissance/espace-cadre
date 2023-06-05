import { apiClient } from 'services/networking/client'
import { newPaginatedResult } from 'api/pagination'
import { format } from 'date-fns'
import { Document } from 'domain/general-meeting-report'
import { downloadFile } from './upload'

export const getDocuments = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`/v3/general_meeting_reports?page=${page}&page_size=20`)
  const documents = data.items.map(
    item => new Document(item.uuid, item.title, item.description, item.date, item.visibility, item.zone, item.file_path)
  )

  return newPaginatedResult(documents, data.metadata)
}
export const createDocument = async document =>
  await apiClient.post('/api/v3/general_meeting_reports', documentToJson(document))
export const updateDocument = async document =>
  await apiClient.put(`/api/v3/general_meeting_reports/${document.id}`, documentToJson(document))
export const downloadDocument = (uuid, endpoint) => downloadFile(`/api/v3/${endpoint}/${uuid}/file`)

const documentToJson = document => ({
  title: document.title,
  description: document.description,
  date: format(document.date, 'yyyy-MM-dd HH:mm:ss'),
  zone: document.zone,
})
