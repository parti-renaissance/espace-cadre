import PropTypes from 'prop-types'

export class SurveyMap {
  constructor(zoneName, latitude, longitude, totalSurveys, surveyData) {
    this.zoneName = zoneName
    this.latitude = latitude
    this.longitude = longitude
    this.totalSurveys = totalSurveys
    this.surveyData = surveyData
  }
}

SurveyMap.propTypes = PropTypes.shape({
  zoneName: PropTypes.string.isRequired,
  latitude: PropTypes.string.isRequired,
  longitude: PropTypes.string.isRequired,
  totalSurveys: PropTypes.bool.isRequired,
  surveyData: PropTypes.array.isRequired,
})
