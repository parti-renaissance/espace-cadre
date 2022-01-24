import { apiClient } from 'services/networking/client'

import { SurveyItem, SurveyItemAuthor } from 'domain/surveys'
import { newPaginatedResult } from 'api/pagination'

export const getSurveysQuery = async ({ pageParam: page = 1 }) => {
  const query = `?order[created_at]=desc&page=${page}&page_size=20`
  const data = await apiClient.get(`api/v3/surveys${query}`)

  const surveys = data.items.map(s => {
    const author = s.creator ? new SurveyItemAuthor(s.creator.first_name, s.creator.last_name) : null
    return new SurveyItem(s.uuid, s.published, s.name, author, s.nb_questions, s.nb_answers)
  })

  return newPaginatedResult(surveys, data.metadata)
}

const formatSurvey = ({ isPublished }) => ({
  ...('boolean' === typeof isPublished && { published: isPublished }),
})
export const createOrUpdateSurveyQuery = survey => {
  const body = formatSurvey(survey)
  if (!survey.id) return apiClient.post('api/v3/surveys', body)
  return apiClient.put(`api/v3/surveys/${survey.id}`, body)
}
