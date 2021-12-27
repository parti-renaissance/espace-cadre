import { useQuery } from 'react-query'
import { getSurveyMapQuery } from 'api/surveyMap'
import { styled } from '@mui/system'
import L from 'leaflet'
import { MapContainer as LeafletContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import pluralize from 'components/shared/pluralize/pluralize'
import DashboardHeader from 'components/Dashboard/shared/DashboardHeader'
import Loading from 'components/Dashboard/shared/Loading'
import Error from 'components/Dashboard/shared/Error'

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
  errorMessage: 'Les données des questionnaires sont indisponibles',
}

const ONE_HOUR = 60 * 60 * 1000

const MapComponent = () => {
  L.Icon.Default.imagePath = '/'

  const {
    data: surveys = {},
    isLoading,
    isError,
  } = useQuery('surveys', getSurveyMapQuery, {
    cacheTime: ONE_HOUR,
    staleTime: ONE_HOUR,
  })

  if (isLoading) return <Loading />
  if (isError) return <Error message={messages.errorMessage} />

  return (
    <>
      <DashboardHeader
        amount={surveys.totalSurveys}
        title={`${pluralize(surveys.totalSurveys, messages.survey)} ${pluralize(
          surveys.totalSurveys,
          messages.filled
        )}`}
        subtitle={messages.subtitle}
      />
      <MapContainer center={[surveys.latitude, surveys.longitude]} zoom={8}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />
        {surveys.surveyResults.map((data, i) => (
          <Marker key={i} position={[data.latitude, data.longitude]}>
            <Popup>
              <strong>{messages.surveyName}</strong> {data.surveyName} <br />
              <strong>{messages.answeredDate}</strong> {data.postedAt}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  )
}

export default MapComponent
