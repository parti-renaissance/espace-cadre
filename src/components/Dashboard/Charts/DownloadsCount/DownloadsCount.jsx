import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Grid, Typography, useTheme } from '@mui/material'
import pluralize from 'components/shared/pluralize/pluralize'
import { downloadsCount } from 'api/dashboard'
import DashboardHeader from 'components/Dashboard/shared/DashboardHeader'
import Loading from 'components/Dashboard/shared/Loading'
import Error from 'components/Dashboard/shared/Error'
import {
  areaMargin,
  chartAxisStyle,
  tooltipContentStyle,
  tooltipCursorStyle,
  tooltipLabelStyle,
  tooltipStyle,
} from 'components/Dashboard/Charts/shared/styles'
import ChartLegend from 'components/Dashboard/Charts/shared/ChartLegend'
import { DASHBOARD_CACHE_DURATION } from 'components/Dashboard/shared/cache'
import { useQueryWithScope } from 'api/useQueryWithScope'

const messages = {
  downloads: 'Téléchargement',
  period: ' lors des 28 derniers jours',
  subtitle: "De l'application Je m'engage sur les stores Android et Apple",
  dailyDownloads: 'Téléchargements par jour',
  errorMessage: "Les données de téléchargement de l'app sont indisponibles",
}

const DownloadsCount = () => {
  const {
    data: downloads = null,
    isLoading,
    isError,
  } = useQueryWithScope(['downloads', { feature: 'Dashboard', view: 'DownloadsCount' }], () => downloadsCount(), {
    cacheTime: DASHBOARD_CACHE_DURATION,
    staleTime: DASHBOARD_CACHE_DURATION,
  })

  const theme = useTheme()

  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    return <Error message={messages.errorMessage} />
  }

  return (
    <>
      <DashboardHeader
        amount={downloads.totalDownloads}
        title={`${pluralize(downloads.totalDownloads, messages.downloads)} ${messages.period}`}
        subtitle={messages.subtitle}
      />

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={downloads.downloads} margin={areaMargin}>
          <defs>
            <linearGradient id="colorQuotidien" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.blueCorner} stopOpacity={0.8} />
              <stop offset="95%" stopColor={theme.palette.blueCorner} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" angle={-14} tickMargin={8} interval={4} style={chartAxisStyle} />
          <YAxis axisLine={false} tickLine={false} style={chartAxisStyle} />
          <CartesianGrid strokeDasharray=".08" />
          <Tooltip
            contentStyle={tooltipContentStyle(theme)}
            labelStyle={tooltipLabelStyle(theme)}
            itemStyle={tooltipStyle}
            cursor={tooltipCursorStyle(theme)}
          />
          <Area
            type="monotone"
            name={messages.dailyDownloads}
            dataKey="unique_user"
            stroke={theme.palette.blueCorner}
            fillOpacity={1}
            fill="url(#colorQuotidien)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <Grid container>
        <Grid item>
          <ChartLegend sx={{ color: theme.palette.blueCorner }}>
            <Typography variant="subtitle2">{messages.dailyDownloads}</Typography>
          </ChartLegend>
        </Grid>
      </Grid>
    </>
  )
}

export default DownloadsCount
