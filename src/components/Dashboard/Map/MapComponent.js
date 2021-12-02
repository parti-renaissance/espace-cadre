import { useState, useEffect } from 'react'
import L from 'leaflet'
import { MapContainer as LeafletContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useDashboardSurveyCache } from '../../../redux/dashboard/hooks'
import { useUserScope } from '../../../redux/user/hooks'
import { apiClientProxy } from 'services/networking/client'
import Loader from 'ui/Loader'
import ErrorComponent from '../../ErrorComponent/ErrorComponent'
import { pluralize } from '../../shared/pluralize'

const MapComponentHeader = styled(Grid)(
  ({ theme }) => `
  padding: ${theme.spacing(2)}
`
)

const CountBubble = styled('span')(
  ({ theme }) => `
  font-size: 18px;
  font-weight: 600;
  color: ${theme.palette.blueCorner};
  background-color: ${theme.palette.blueBubble};
  padding: ${theme.spacing(1)};
  margin-right: ${theme.spacing(1)};
  border-radius: 8.35px;
`
)

const SurveyCount = styled(Typography)(
  ({ theme }) => `
  font-weight: 600;
  color: ${theme.palette.blackCorner};
`
)

const Subtitle = styled(Typography)(
  ({ theme }) => `
  font-size: 12px;
  font-weight: 400;
  color: ${theme.palette.grayCorner3};
`
)

const MapContainer = styled(LeafletContainer)(
  () => `
  width: 100%;
  height: 500px;
  border-radius: 0 0 6px 6px;
`
)

const messages = {
  subtitle: 'Répartition géographique dans votre région',
  survey: 'Questionnaire',
  filled: 'rempli',
  surveyName: 'Nom du sondage:',
  answeredDate: 'Répondu le:',
}

function MapComponent() {
  L.Icon.Default.imagePath = '/'
  const [dashboardSurvey, setDashboardSurvey] = useDashboardSurveyCache()
  const [currentScope] = useUserScope()
  const [errorMessage, setErrorMessage] = useState()
  const { total_surveys: totalSurveys, survey_datas: surveyData, latitude, longitude } = dashboardSurvey || {}

  useEffect(() => {
    const getSurvey = async () => {
      try {
        if (dashboardSurvey === null && currentScope) {
          setDashboardSurvey(await apiClientProxy.get('/jemengage/survey'))
        }
      } catch (error) {
        setErrorMessage(error)
      }
    }
    getSurvey()
  }, [currentScope, dashboardSurvey, setDashboardSurvey])

  return (
    <>
      {dashboardSurvey ? (
        <>
          <MapComponentHeader container>
            <CountBubble>{totalSurveys}</CountBubble>
            <Grid item>
              <SurveyCount display="block">
                {pluralize(totalSurveys, messages.survey)} {pluralize(totalSurveys, messages.filled)}
              </SurveyCount>
              <Subtitle display="block">{messages.subtitle}</Subtitle>
            </Grid>
          </MapComponentHeader>
          <MapContainer center={[latitude, longitude]} zoom={8}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            />

            {surveyData.map(data => (
              <Marker key={data.id} position={[data.latitude, data.longitude]}>
                <Popup>
                  <strong>{messages.surveyName}</strong> {data.data_survey.survey.name} <br />
                  <strong>{messages.answeredDate}</strong> {data.data_survey.posted_at}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </>
      ) : (
        <div xs={{ textAlign: 'center' }}>
          <Loader />
        </div>
      )}
      {errorMessage && <ErrorComponent errorMessage={errorMessage} />}
    </>
  )
}

export default MapComponent
