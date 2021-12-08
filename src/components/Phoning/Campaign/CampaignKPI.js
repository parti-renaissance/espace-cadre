import { Grid, Paper, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { differenceInCalendarDays, format } from 'date-fns'

import { CardRootWrapper, CardContentWrapper } from './shared/components'
import PhoningCampaign from 'domain/phoning-campaign'
import UICard from 'ui/Card/Card'
import PhoningRatioProgress from '../shared/PhoningRatioProgress'

const KPIWrapper = styled(Paper)(
  ({ theme }) => `
  width: 100%;
  padding: ${theme.spacing(2)};
  background: ${theme.palette.gray200};
  border-radius: 12px;
`
)
const KPITitle = styled(Typography)(
  ({ theme }) => `
  margin: ${theme.spacing(1, 0, 2, 1)};
  font-size: 18px;
  font-weight: 400px;
  line-height: 27px;
`
)
const Score = styled(Typography)(
  ({ theme }) => `
  font-size: 28px;
  font-weight: 600;
  line-height: 42px;
  color: ${theme.palette.phoning.background.ratio.current};
`
)
const SubTitle = styled(props => <Typography variant="subtitle1" {...props} />)(
  ({ theme }) => `
  color: ${theme.palette.gray900};
`
)
const SubTitleDetail = styled(props => <Typography variant="subtitle2" {...props} />)(
  ({ theme }) => `
  color: ${theme.palette.gray600};
`
)

const messages = {
  title: 'Indicateurs',
  dayRemaining: 'Jours restants',
  periodFrom: 'Du',
  periodTo: 'au',
  surveys: 'Questionnaires',
  calls: 'Appels passés',
  callsToRemindPrefix: 'Dont',
  callsToRemindSuffix: 'à rappeler',
  contacts: 'Contacts',
  averageTime: 'Temps moyen',
  averageTimeDetail: 'Passé par appel',
}

const PhoningCampaignKPI = ({ startDate, endDate, surveys, calls, averageTime }) => (
  <KPIWrapper>
    <Grid container>
      <KPITitle>{messages.title}</KPITitle>
    </Grid>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
        <UICard
          rootProps={{ component: CardRootWrapper }}
          contentProps={{ component: CardContentWrapper }}
          content={
            <>
              <Score>{differenceInCalendarDays(new Date(endDate), new Date())}</Score>
              <SubTitle>{messages.dayRemaining}</SubTitle>
              {startDate && endDate && (
                <SubTitleDetail>
                  {messages.periodFrom}&nbsp;
                  {format(new Date(startDate), 'dd/MM/yyyy')}&nbsp;
                  {messages.periodTo}&nbsp;
                  {format(new Date(endDate), 'dd/MM/yyyy')}
                </SubTitleDetail>
              )}
            </>
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
        <UICard
          rootProps={{
            component: props => (
              <CardRootWrapper direction="column" alignItems="flex-start" justifyContent="center" {...props} />
            ),
          }}
          headerProps={{ sx: { pt: 0, pb: 3, px: 2 } }}
          contentProps={{ component: CardContentWrapper }}
          headerTitle={<SubTitle>{messages.surveys}</SubTitle>}
          content={<PhoningRatioProgress count={surveys.count} totalCount={surveys.goal} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
        <UICard
          rootProps={{ component: CardRootWrapper }}
          contentProps={{ component: CardContentWrapper }}
          content={
            <>
              <Score>{calls.count}</Score>
              <SubTitle>{messages.calls}</SubTitle>
              <SubTitleDetail>
                {messages.callsToRemindPrefix}&nbsp;
                {calls.toRemind}&nbsp;
                {messages.callsToRemindSuffix}
              </SubTitleDetail>
            </>
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
        <UICard
          rootProps={{ component: CardRootWrapper }}
          contentProps={{ component: CardContentWrapper }}
          content={
            <>
              <Score>{averageTime}</Score>
              <SubTitle>{messages.averageTime}</SubTitle>
              <SubTitleDetail>{messages.averageTimeDetail}</SubTitleDetail>
            </>
          }
        />
      </Grid>
    </Grid>
  </KPIWrapper>
)

PhoningCampaignKPI.propTypes = PhoningCampaign.PropTypes

export default PhoningCampaignKPI
