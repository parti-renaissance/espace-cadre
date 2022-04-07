import { styled } from '@mui/system'
import { Grid, Typography } from '@mui/material'
import UIContainer from 'ui/Container'
import PropTypes from 'prop-types'
import UILoader from 'ui/Loader/Loader'
import ErrorComponent from 'components/ErrorComponent'
import RatioProgress from 'ui/RatioProgress/RatioProgress'
import { useCurrentDeviceType } from 'components/shared/device/hooks'

const KPIContainer = styled(Grid)(
  ({ theme }) => `
  background-color: ${theme.palette.gray200};
  margin-bottom: ${theme.spacing(2)};
  border-radius: ${theme.spacing(1.5)};
`
)

const KPITitle = styled(Typography)(
  ({ theme }) => `
  color: ${theme.palette.blackCorner};
  font-size: 18px;
  font-weight: 400;
  line-height: 27px;
`
)

const CardContainer = styled(Grid)`
  &:last-child {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
`

const MainInfo = styled(Typography)`
  font-size: 40px;
  font-weight: 600;
  text-align: left;
  color: ${({ theme }) => theme.palette.blueCorner};
`

const MainText = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.blackCorner};
`

const SecondaryText = styled(Typography)`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.grayCorner3};
`

const LoaderContainer = styled(props => <Grid item xs={12} {...props} />)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.whiteCorner};
  border-radius: 6px;
  height: 120px;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

export const KPICard = ({ main, title, subtitle }) => (
  <CardContainer item xs={12} sm={6} lg={3} data-cy="KPICard">
    <UIContainer rootProps={{ sx: { p: 2 } }}>
      <MainInfo component="div">{main}</MainInfo>
      <MainText component="div">{title}</MainText>
      <SecondaryText component="div">{subtitle || <>&nbsp;</>}</SecondaryText>
    </UIContainer>
  </CardContainer>
)
KPICard.propTypes = {
  main: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  subtitle: PropTypes.node,
}

export const KPIProgressCard = ({ title, count, total }) => (
  <CardContainer item xs={12} sm={6} lg={3} data-cy="KPICard">
    <UIContainer
      rootProps={{
        sx: { p: 2, display: 'flex', flexDirection: 'column', height: '134px', justifyContent: 'space-between' },
      }}
    >
      <MainText component="div">{title}</MainText>
      <RatioProgress count={count} totalCount={total} />
    </UIContainer>
  </CardContainer>
)
KPIProgressCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
}

const messages = {
  kpi: 'Indicateurs',
}

export const KPIs = ({ title = messages.kpi, children, isLoading = false, error = false }) => {
  const { isMobile } = useCurrentDeviceType()

  if (isLoading) {
    return (
      <LoaderContainer>
        <UILoader />
      </LoaderContainer>
    )
  }
  if (error) {
    return (
      <LoaderContainer>
        <ErrorComponent errorMessage={{ message: error }} />
      </LoaderContainer>
    )
  }

  return (
    <KPIContainer container data-cy="KPI">
      <Grid container>
        <Grid item xs={12} sx={{ m: 2 }}>
          <KPITitle>{title}</KPITitle>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sx={{ px: 2 }}>
          <Grid
            container
            spacing={2}
            sx={{
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              overflowX: 'scroll',
              overflowY: 'hidden',
              '::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {children}
          </Grid>
        </Grid>
      </Grid>
    </KPIContainer>
  )
}

KPIs.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
}
