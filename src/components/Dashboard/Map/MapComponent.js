import { useQuery } from 'react-query'
import { getSurveyMapQuery } from 'api/surveyMap'
import Loader from 'ui/Loader'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import L from 'leaflet'
import { MapContainer as LeafletContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import pluralize from 'components/shared/pluralize/pluralize'
import { useErrorHandler } from 'components/shared/error/hooks'

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
  font-size: 16px;
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
  const { handleError } = useErrorHandler()
  const { data: surveys = {}, isFetching } = useQuery('surveys', () => getSurveyMapQuery(), { onError: handleError })
  L.Icon.Default.imagePath = '/'

  return (
    <>
      {isFetching && (
        <Grid container justifyContent="center">
          <Loader />
        </Grid>
      )}
      {Object.keys(surveys).length > 0 && (
        <>
          <Grid container sx={{ padding: 2 }}>
            <CountBubble>{surveys.totalSurveys}</CountBubble>
            <Grid item>
              <SurveyCount display="block">
                {pluralize(surveys.totalSurveys, messages.survey)} {pluralize(surveys.totalSurveys, messages.filled)}
              </SurveyCount>
              <Subtitle display="block">{messages.subtitle}</Subtitle>
            </Grid>
          </Grid>
          <MapContainer center={[surveys.latitude, surveys.longitude]} zoom={8}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            />
            {surveys.surveyResults.map(data => (
              <Marker key={data.id} position={[data.latitude, data.longitude]}>
                <Popup>
                  <strong>{messages.surveyName}</strong> {data.surveyName} <br />
                  <strong>{messages.answeredDate}</strong> {data.postedAt}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </>
      )}
    </>
  )
}

export default MapComponent
