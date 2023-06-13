import { getSurveyMapQuery } from 'api/surveyMap'
import { styled } from '@mui/system'
import L from 'leaflet'
import { MapContainer as LeafletContainer, TileLayer, Marker, Popup, AttributionControl } from 'react-leaflet'
import pluralize from 'components/shared/pluralize/pluralize'
import DashboardHeader from 'components/Dashboard/shared/DashboardHeader'
import Loading from 'components/Dashboard/shared/Loading'
import Error from 'components/Dashboard/shared/Error'
import { DASHBOARD_CACHE_DURATION } from 'components/Dashboard/shared/cache'
import { useQueryWithScope } from 'api/useQueryWithScope'

const MapContainer = styled(LeafletContainer)(
  () => `
  width: 100%;
  height: 500px;
  border-radius: 0 0 6px 6px;
`
)

const messages = {
  subtitle: 'Répartition géographique dans votre région sur ces 30 derniers jours',
  survey: 'Questionnaire',
  filled: 'rempli',
  surveyName: 'Nom du sondage:',
  answeredDate: 'Répondu le:',
  errorMessage: 'Les données des questionnaires sont indisponibles',
}

const MapComponent = () => {
  L.Icon.Default.imagePath = '/'

  const {
    data: surveys = {},
    isLoading,
    isError,
  } = useQueryWithScope(['surveys', { feature: 'Dashboard', view: 'MapComponent' }], getSurveyMapQuery, {
    cacheTime: DASHBOARD_CACHE_DURATION,
    staleTime: DASHBOARD_CACHE_DURATION,
  })

  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    return <Error message={messages.errorMessage} />
  }

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
      <MapContainer center={[surveys.latitude, surveys.longitude]} zoom={8} attributionControl={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />

        <AttributionControl prefix={'Leaflet'} />

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
