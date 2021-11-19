import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Grid, Box } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { useDashboardSurveyCache } from '../../../redux/dashboard/hooks'
import { apiClientProxy } from 'services/networking/client'
import Loader from 'ui/Loader'
import { useUserScope } from '../../../redux/user/hooks'
import ErrorComponent from '../../ErrorComponent/ErrorComponent'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
  },
  leafletContainer: {
    width: '100%',
    height: '500px',
    borderRadius: '0 0 6px 6px',
  },
  countBubble: {
    color: theme.palette.blueCorner,
    fontWeight: '600',
    fontSize: '18px',
    backgroundColor: theme.palette.blueBubble,
    padding: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: '6px',
  },
  chartTitle: {
    color: theme.palette.blackCorner,
    fontWeight: '600',
  },
  chartSubtitle: {
    color: theme.palette.grayCorner3,
    fontSize: '12px',
    fontWeight: '400',
  },
}))

function MapComponent() {
  const classes = useStyles()
  const [dashboardSurvey, setDashboardSurvey] = useDashboardSurveyCache()
  const [currentScope] = useUserScope()
  const [errorMessage, setErrorMessage] = useState()

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

  L.Icon.Default.imagePath = '/'

  const dashboardSurveyContent = () => {
    if (dashboardSurvey) {
      return (
        <>
          <Grid container className={classes.container}>
            <span className={classes.countBubble}>{dashboardSurvey.survey_datas.length}</span>
            <Grid item>
              <Box className={classes.chartTitle}>
                Questionnaire{dashboardSurvey.survey_datas.length > 1 && 's'} rempli
                {dashboardSurvey.survey_datas.length > 1 && 's'}
              </Box>
              <Box className={classes.chartSubtitle}>Répartition géographique dans votre région</Box>
            </Grid>
          </Grid>
          <MapContainer
            center={[dashboardSurvey.latitude, dashboardSurvey.longitude]}
            zoom={8}
            className={classes.leafletContainer}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            />

            {dashboardSurvey.survey_datas.map(data => (
              <Marker key={data.id} position={[data.latitude, data.longitude]}>
                <Popup>
                  <strong>Nom du sondage:</strong> {data.data_survey.survey.name} <br />
                  <strong>Répondu le:</strong> {data.data_survey.posted_at}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </>
      )
    }
    if (errorMessage) {
      return <ErrorComponent errorMessage={errorMessage} />
    }
    return (
      <Box style={{ textAlign: 'center' }}>
        <Loader />
      </Box>
    )
  }

  return <>{dashboardSurveyContent()}</>
}

export default MapComponent
