import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { Grid, Typography, useTheme } from '@mui/material'
import pluralize from 'components/shared/pluralize/pluralize'
import { usersCount } from 'api/dashboard'
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
  user: 'Utilisateur',
  period: 'lors des 28 derniers jours',
  active: 'Actif',
  activeWording: "sur l'application Je m'engage",
  dailyUsers: 'Utilisateurs par jour',
  monthlyUsers: 'Utilisateurs cumulés sur le mois',
  errorMessage: "Le nombre d'utilisateurs actifs de l'app n'est pas renseigné",
}

const ActiveUsers = () => {
  const theme = useTheme()

  const {
    data: users = null,
    isLoading,
    isError,
  } = useQueryWithScope(['users', { feature: 'Dashboard', view: 'ActiveUsers' }], () => usersCount(), {
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
        amount={users.totalUsers}
        title={`${pluralize(users.totalUsers, messages.user)} ${messages.period} `}
        subtitle={`${pluralize(users.totalUsers, messages.active)} ${messages.activeWording} `}
      />
      <Grid container>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={users.users} margin={areaMargin}>
            <defs>
              <linearGradient id="colorQuotidien" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.blueCorner} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme.palette.blueCorner} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCumul" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
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
              name={messages.dailyUsers}
              type="monotone"
              dataKey="unique_user"
              stroke={theme.palette.blueCorner}
              fillOpacity={1}
              fill="url(#colorUnique)"
            />
            <Area
              name={messages.monthlyUsers}
              type="monotone"
              dataKey="rolling_seven_users"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorCumul)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Grid>
      <Grid container>
        <Grid item>
          <ChartLegend sx={{ color: theme.palette.blueCorner }}>
            <Typography variant="subtitle2">{messages.dailyUsers}</Typography>
          </ChartLegend>
        </Grid>
        <Grid item>
          <ChartLegend sx={{ color: '#82ca9d' }}>
            <Typography variant="subtitle2">{messages.monthlyUsers}</Typography>
          </ChartLegend>
        </Grid>
      </Grid>
    </>
  )
}

export default ActiveUsers
