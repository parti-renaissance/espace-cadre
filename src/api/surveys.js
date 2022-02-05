import { saveAs } from 'file-saver'
import { format } from 'date-fns'
import { apiClient } from 'services/networking/client'

import {
  SurveyItem,
  SurveyItemAuthor,
  SurveyItemZone,
  SurveyDetail,
  SurveyDetailAuthor,
  SurveyDetailQuestion,
  SurveyDetailChoice,
  SurveyDetailReply,
  SurveyDetailReplyAnswer,
  SurveyDetailReplyAuthor,
} from 'domain/surveys'
import { newPaginatedResult } from 'api/pagination'

export const formatZone = zone => new SurveyItemZone(zone.uuid, zone.code, zone.name)
export const getSurveysQuery = async ({ pageParam: page = 1 }) => {
  const query = `?order[created_at]=desc&page=${page}&page_size=20`
  const data = await apiClient.get(`api/v3/surveys${query}`)

  const surveys = data.items.map(s => {
    const author = s.creator ? new SurveyItemAuthor(s.creator.first_name, s.creator.last_name) : null
    const zone = s.zone ? formatZone(s.zone.uuid, s.zone.code, s.zone.name) : null
    return new SurveyItem(s.uuid, s.published, s.name, author, s.nb_questions, s.nb_answers, s.type, zone)
  })

  return newPaginatedResult(surveys, data.metadata)
}

export const getOneSurveyQuery = async surveyId => {
  const data = await apiClient.get(`api/v3/surveys/${surveyId}`)

  const author = data.creator ? new SurveyDetailAuthor(data.creator.first_name, data.creator.last_name) : null
  const questions = data.questions.map(q => {
    const choices = q.choices.map(c => new SurveyDetailChoice(c.id, c.content))
    return new SurveyDetailQuestion(q.id, q.type, q.content, choices)
  })

  return new SurveyDetail(data.uuid, data.published, data.name, author, questions)
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

const formatSurvey = ({ type, title, isPublished, questions, zone }) => ({
  type,
  ...('boolean' === typeof isPublished && { published: isPublished }),
  name: title,
  questions,
  zone,
})

export const createOrUpdateSurveyQuery = survey => {
  const body = formatSurvey(survey)
  if (!survey.id) return apiClient.post('api/v3/surveys', body)
  return apiClient.put(`api/v3/surveys/${survey.id}`, body)
}
