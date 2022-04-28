import PropTypes from 'prop-types'

export class SurveyMap {
  constructor(zoneName, latitude, longitude, totalSurveys, surveyResults) {
    this.zoneName = zoneName
    this.latitude = latitude
    this.longitude = longitude
    this.totalSurveys = totalSurveys
    this.surveyResults = surveyResults
  }
}

export class SurveyResults {
  constructor(id, latitude, longitude, surveyName, postedAt) {
    this.id = id
    this.latitude = latitude
    this.longitude = longitude
    this.surveyName = surveyName
    this.postedAt = postedAt
  }
}

SurveyMap.propTypes = PropTypes.shape({
  zoneName: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  totalSurveys: PropTypes.number.isRequired,
})

SurveyResults.propTypes = {
  id: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  surveyName: PropTypes.string.isRequired,
  postedAt: PropTypes.string.isRequired,
}
