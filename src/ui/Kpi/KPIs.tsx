import { Stack, styled } from '@mui/system'
import { Card, Grid, Typography } from '@mui/material'
import UIContainer from '~/ui/Container'
import PropTypes from 'prop-types'
import UILoader from '~/ui/Loader/Loader'
import ErrorComponent from '~/components/ErrorComponent'
import RatioProgress from '~/ui/RatioProgress/RatioProgress'
import { grey } from '~/theme/palette'
import { ComponentProps } from 'react'

const ChildrenContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    flexWrap: 'nowrap',
    overflowX: 'auto',
    overflowY: 'hidden',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
}))
const CardContainer = styled(Grid)`
  &:last-child {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
`

const MainText = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.blackCorner};
` as typeof Typography

const LoaderContainer = styled((props: ComponentProps<typeof Grid>) => <Grid item xs={12} {...props} />)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.palette.whiteCorner};
  border-radius: 6px;
  height: 120px;
  margin-bottom: ${theme.spacing(2)};
`
)

type KPICardProps = {
  main: React.ReactNode
  title: React.ReactNode
  icon?: React.ReactNode
  subtitle?: React.ReactNode
}

export const KPICard = ({ main, title, icon, subtitle }: KPICardProps) => (
  <Grid
    item
    xs={4}
    lg={12}
    data-cy="KPICard"
    flexGrow={{ xs: 1, lg: 0 }}
    maxWidth={{ xs: 'none', lg: 300 }}
    border={{ xs: `1px solid ${grey[300]}`, md: 'none' }}
    borderRadius={{ xs: 1, md: 0 }}
    padding={{ xs: 2, md: 0 }}
  >
    <Stack justifyContent="center" height="100%">
      <Stack direction={{ xs: 'column-reverse', lg: 'row' }} width="100%" alignItems="center" gap={{ xs: 1, md: 0 }}>
        <Stack alignItems={{ xs: 'center', lg: 'start' }} width="100%" justifyContent="center">
          <Stack direction={{ xs: 'column-reverse', lg: 'column' }} alignItems={{ xs: 'center', lg: 'start' }}>
            <Stack direction="column">
              <Typography
                fontSize={{ xs: 'small', md: 'subtitle2' }}
                fontWeight={{ xs: 400, md: 600 }}
                color={{ xs: grey[600], md: grey[800] }}
                variant="subtitle2"
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography fontSize="small" color={grey[800]} variant="caption">
                  {subtitle}
                </Typography>
              )}
            </Stack>
            <Typography variant="h3">{main}</Typography>
          </Stack>
        </Stack>
        {icon && (
          <Stack
            alignItems={{ xs: 'center', sm: 'end', lg: 'center' }}
            justifyContent="center"
            width={{ xs: 'auto', lg: '100%' }}
          >
            {icon}
          </Stack>
        )}
      </Stack>
    </Stack>
  </Grid>
)
KPICard.propTypes = {
  main: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  subtitle: PropTypes.node,
}

export const KPIProgressCard = ({ title, count, total }: { title: string; count: number; total: number }) => (
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

interface KPIsProps {
  title?: string
  children: React.ReactNode
  isLoading?: boolean
  error?: boolean | string
}

export const KPIs = ({ children, isLoading = false, error = false }: KPIsProps) => {
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
    <Card
      sx={{
        border: 'dashed',
        borderColor: grey[300],
        borderWidth: 2,
        minHeight: 118,
        boxShadow: 'none',
        p: 3,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}
      data-cy="KPI"
    >
      <ChildrenContainer container display="flex" alignItems="stretch" justifyContent="center" gap={3}>
        {children}
      </ChildrenContainer>
    </Card>
  )
}

KPIs.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
}
