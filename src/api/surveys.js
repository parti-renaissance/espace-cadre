import { saveAs } from 'file-saver'
import { format } from 'date-fns'
import { apiClient } from 'services/networking/client'

import {
  SurveyItem,
  SurveyItemAuthor,
  SurveyDetail,
  SurveyDetailReply,
  SurveyDetailReplyAnswer,
  SurveyDetailReplyAuthor,
} from 'domain/surveys'
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

export const getSurveyQuery = async surveyId => {
  const data = await apiClient.get(`api/v3/surveys/${surveyId}`)
  return new SurveyDetail(data.uuid, data.name)
}

export const getSurveyRepliesQuery = async surveyId => {
  const data = await apiClient.get(`api/v3/surveys/${surveyId}/replies`)

  return data.items.map(sr => {
    const author = sr.author
      ? new SurveyDetailReplyAuthor(sr.author.first_name, sr.author.last_name, sr.author.gender, sr.author.age)
      : null
    return new SurveyDetailReply(
      sr.answers.map(a => new SurveyDetailReplyAnswer(a.type, a.answer, a.question)),
      author,
      new Date(sr.begin_at),
      new Date(sr.finish_at)
    )
  })
}

export const getSurveysRepliesExport = async (surveyId, surveyTitle) => {
  const data = await apiClient.get(`api/v3/surveys/${surveyId}/replies.xls`)
  saveAs(new Blob([data]), `${surveyTitle} - ${format(new Date(), 'dd.MM.yyyy')}.xlsx`)
}

const formatSurvey = ({ isPublished }) => ({
  ...('boolean' === typeof isPublished && { published: isPublished }),
})
export const createOrUpdateSurveyQuery = survey => {
  const body = formatSurvey(survey)
  if (!survey.id) return apiClient.post('api/v3/surveys', body)
  return apiClient.put(`api/v3/surveys/${survey.id}`, body)
}
