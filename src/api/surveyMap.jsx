import { apiClientProxy } from 'services/networking/client'
import { SurveyMap, SurveyResults } from 'domain/surveyMap'

export const getSurveyMapQuery = async () => {
  const data = await apiClientProxy.get('/jemengage/survey')
  return new SurveyMap(
    data.zone_name,
    data.latitude,
    data.longitude,
    data.total_surveys,
    data.survey_datas.map(
      r => new SurveyResults(r.id, r.latitude, r.longitude, r.data_survey.survey.name, r.data_survey.posted_at)
    )
  )
}
