import { format } from 'date-fns'
import { apiClient } from 'services/networking/client'

import {
  SurveyItem,
  SurveyItemAuthor,
  SurveyItemZone,
  SurveyDetail,
  SurveyDetailQuestion,
  SurveyDetailChoice,
  SurveyDetailReply,
  SurveyDetailReplyAnswer,
  SurveyDetailReplyAuthor,
  SurveyDetailCreator,
  SurveyKPIs,
} from 'domain/surveys'
import { newPaginatedResult } from 'api/pagination'
import { downloadFile } from './upload'

export const formatZone = zone => new SurveyItemZone(zone.uuid, zone.code, zone.name)

export const getSurveysQuery = async ({ pageParam: page = 1 }, type = '') => {
  const query = `?order[created_at]=desc&page=${page}&page_size=50&type=${type}`
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
  const creator = data.creator ? new SurveyDetailCreator(data.creator.first_name, data.creator.last_name) : null

  const questions = data.questions.map(q => {
    const choices = q.choices.map(c => new SurveyDetailChoice(c.id, c.content))
    return new SurveyDetailQuestion(q.id, q.type, q.content, choices)
  })

  return new SurveyDetail(data.uuid, data.published, data.name, questions, data.type, creator)
}

export const getSurveysKpis = async () => {
  const data = await apiClient.get('api/v3/surveys/kpi')
  return new SurveyKPIs(
    data.local_surveys_count,
    data.local_surveys_published_count,
    data.national_surveys_count,
    data.national_surveys_published_count
  )
}

export const getSurveyRepliesQuery = async surveyId => {
  const data = await apiClient.get(`api/v3/surveys/${surveyId}/replies`)

  return data.items.map(sr => {
    const author = sr.author
      ? new SurveyDetailReplyAuthor(sr.author.first_name, sr.author.last_name, sr.author.gender, sr.author.age)
      : null
    return new SurveyDetailReply(
      sr.answers.map(a => new SurveyDetailReplyAnswer(a.type, a.answer, a.question, a.question_id)),
      author,
      new Date(sr.begin_at),
      new Date(sr.finish_at)
    )
  })
}

export const getSurveysRepliesExport = (surveyId, surveyTitle) =>
  downloadFile(`api/v3/surveys/${surveyId}/replies.xls`, `${surveyTitle} - ${format(new Date(), 'dd.MM.yyyy')}.xls`)

const formatChoicePayload =
  useIds =>
  ({ id, content }) => ({
    ...(useIds && 'number' === typeof id && { id }),
    content,
  })
const formatQuestionPayload =
  useIds =>
  ({ id, type, content, choices }) => ({
    ...(useIds && 'number' === typeof id && { id }),
    question: {
      type,
      content,
      choices: choices.filter(({ content }) => content).map(formatChoicePayload(useIds)),
    },
  })
const formatSurveyPayload = ({ id, isPublished, type, title, zone, questions }) => ({
  ...('boolean' === typeof isPublished && { published: isPublished }),
  ...(type && { type }),
  ...(title && { name: title }),
  ...(zone && { zone: zone?.id || null }),
  ...(questions && { questions: questions.map(formatQuestionPayload(!!id)) }),
})

export const createOrUpdateSurveyQuery = survey => {
  const body = formatSurveyPayload(survey)
  if (!survey.id) {
    return apiClient.post('api/v3/surveys', body)
  }

  return apiClient.put(`api/v3/surveys/${survey.id}`, body)
}
