import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Grid, Typography } from '@mui/material'
import Loader from 'ui/Loader'
import ErrorComponent from 'components/ErrorComponent'
import UIContainer from 'ui/Container'
import pluralize from 'components/shared/pluralize/pluralize'
import { useQuery } from 'react-query'
import { styled } from '@mui/system'
import { downloadsCount } from 'api/downloads'

const CountBubble = styled('span')`
  color: ${({ theme }) => theme.palette.blueCorner};
  font-weight: 600;
  font-size: 18px;
  background-color: ${({ theme }) => theme.palette.blueBubble};
  padding: ${({ theme }) => theme.spacing(1)};
  margin-right: ${({ theme }) => theme.spacing(1)};
  border-radius: 8px;
`

const messages = {
  downloads: 'Téléchargement',
  period: ' lors des 28 derniers jours',
  subtitle: "De l'application Je m'engage sur les stores Android et Apple",
  dailyDownloads: 'Téléchargements par jour',
  errorMessage: "Les données de téléchargement de l'app sont indisponibles",
}

const ChartLegend = styled('li')`
  margin: ${({ theme }) => theme.spacing(2, 2, 2, 4)};
  font-size: 12px;
`

const DownloadsCount = () => {
  const {
    data: downloads = null,
    isLoading,
    isError,
  } = useQuery('downloads', downloadsCount, {
    cacheTime: 60 * 60 * 1000,
    staleTime: 60 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <UIContainer textAlign="center">
        <Loader />
      </UIContainer>
    )
  }
  if (isError) {
    return (
      <UIContainer textAlign="center">
        <ErrorComponent errorMessage={{ message: messages.errorMessage }} />
      </UIContainer>
    )
  }

  return (
    <>
      <Grid container sx={{ p: 2 }}>
        <CountBubble>{downloads.totalDownloads}</CountBubble>
        <Grid item>
          <Typography variant="subtitle1" component="div" sx={{ color: 'blackCorner' }}>
            {pluralize(downloads.totalDownloads, messages.downloads)}
            {messages.period}
          </Typography>
          <Typography variant="subtitle2" component="div" sx={{ color: 'grayCorner3' }}>
            {messages.subtitle}
          </Typography>
        </Grid>
      </Grid>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={downloads.downloads}
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
          <ChartLegend sx={{ color: '#0049C6' }}>
            <Typography variant="subtitle2">{messages.dailyDownloads}</Typography>
          </ChartLegend>
        </Grid>
      </Grid>
    </>
  )
}

export default DownloadsCount
