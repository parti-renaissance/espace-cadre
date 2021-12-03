import { useState, useEffect } from 'react'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useDashboardDownloadsCache } from '../../../../redux/dashboard/hooks'
import { apiClientProxy } from 'services/networking/client'
import Loader from 'ui/Loader'
import { useUserScope } from '../../../../redux/user/hooks'
import ErrorComponent from 'components/ErrorComponent'
import UIContainer from 'ui/Container'
import { pluralize } from 'components/shared/pluralize'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
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
  legendChart: {
    fontSize: '12px',
    fontWeight: '400',
    margin: theme.spacing(2, 2, 2, 4),
  },
  noData: {
    padding: theme.spacing(2),
  },
}))

const messages = {
  downloads: 'Téléchargement',
  period: ' lors des 28 derniers jours',
  subtitle: "De l'application Je m'engage sur les stores Android et Apple",
  dailyDownloads: 'Téléchargements par jour',
  errorMessage: "Les données de téléchargement de l'app sont indisponibles",
}

function DownloadsCount() {
  const classes = useStyles()
  const [dashboardDownloads, setDashboardDownloads] = useDashboardDownloadsCache()
  const [currentScope] = useUserScope()
  const [errorMessage, setErrorMessage] = useState()
  const { totalDownloads, downloads } = dashboardDownloads || {}
  useEffect(() => {
    const getDownloads = async () => {
      try {
        if (dashboardDownloads === null && currentScope) {
          setDashboardDownloads(await apiClientProxy.get('/jemengage/downloads'))
        }
      } catch (error) {
        setErrorMessage(error)
      }
    }
    getDownloads()
  }, [currentScope, dashboardDownloads, setDashboardDownloads])

  const dashboardDownloadsContent = () => {
    if (dashboardDownloads !== null && downloads.length > 0) {
      return (
        <>
          <Grid container className={classes.container}>
            <span className={classes.countBubble}>{totalDownloads}</span>
            <Grid item>
              <div className={classes.chartTitle}>
                {pluralize(totalDownloads, messages.downloads)}
                {messages.period}
              </div>
              <div className={classes.chartSubtitle}>{messages.subtitle}</div>
            </Grid>
          </Grid>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={downloads}
              margin={{
                top: 5,
                right: 20,
                bottom: 5,
                left: 0,
              }}
            >
              <defs>
                <linearGradient id="colorQuotidien" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0049C6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0049C6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                angle={-14}
                tickMargin={8}
                interval={4}
                style={{
                  color: '#717BA0',
                  fontFamily: 'roboto',
                  fontSize: '12px',
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                style={{
                  color: '#717BA0',
                  fontFamily: 'roboto',
                  fontSize: '12px',
                }}
              />
              <CartesianGrid strokeDasharray=".08" />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  borderColor: '#F0F1F3',
                  borderRadius: '6px',
                }}
                labelStyle={{
                  fontSize: '14px',
                  color: '#1A334D',
                  fontFamily: 'Poppins',
                  fontWeight: 'bold',
                  padding: '2px 5px',
                  textAlign: 'left',
                }}
                itemStyle={{
                  fontSize: '14px',
                  fontFamily: 'Poppins',
                  padding: '2px 5px',
                  textAlign: 'left',
                }}
                cursor={{
                  stroke: '#0049C6',
                  strokeWidth: 0.5,
                }}
              />
              <Area
                type="monotone"
                name={messages.dailyDownloads}
                dataKey="unique_user"
                stroke="#0049C6"
                fillOpacity={1}
                fill="url(#colorQuotidien)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <Grid container>
            <Grid item>
              <li className={classes.legendChart} style={{ color: '#0049C6' }}>
                {messages.dailyDownloads}
              </li>
            </Grid>
          </Grid>
        </>
      )
    }
    if (dashboardDownloads !== null && downloads.length === 0) {
      return <UIContainer className={classes.noData}>{messages.errorMessage}</UIContainer>
    }
    if (errorMessage) {
      return <ErrorComponent errorMessage={errorMessage} />
    }
    return (
      <UIContainer textAlign="center">
        <Loader />
      </UIContainer>
    )
  }

  return <div>{dashboardDownloadsContent()}</div>
}

export default DownloadsCount
