import { Grid, Paper, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { differenceInCalendarDays, format } from 'date-fns'

import pluralize from 'components/shared/pluralize/pluralize'
import { PhoningCampaign } from 'domain/phoning'
import RatioProgress from '../shared/RatioProgress'
import { secondsToMinutesAndSeconds } from './shared/helpers'
import UICard from 'ui/Card/Card'

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
  day: 'Jour',
  remaining: 'restant',
  periodFrom: 'Du',
  periodTo: 'au',
  surveys: 'Questionnaire',
  calls: 'Appel',
  callsMade: 'passé',
  callsToRemindPrefix: 'Dont',
  callsToRemindSuffix: 'à rappeler',
  contacts: 'Contacts',
  averageTime: 'Temps moyen',
  averageTimeDetail: 'Passé par appel',
}

const CampaignDetailKPI = ({ startDate, endDate, surveys, calls, averageTime }) => {
  const daysRemaining = differenceInCalendarDays(endDate, new Date()) || 0

  return (
    <KPIWrapper>
      <Grid container>
        <KPITitle>{messages.title}</KPITitle>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <UICard
            rootProps={{ sx: { height: '125px' } }}
            contentProps={{ sx: { pt: '25px' } }}
            content={
              <>
                <Score>{daysRemaining <= 0 ? 0 : daysRemaining}</Score>
                <SubTitle>
                  {pluralize(daysRemaining, messages.day)}&nbsp;
                  {pluralize(daysRemaining, messages.remaining)}
                </SubTitle>
                {startDate && endDate && (
                  <SubTitleDetail>
                    {messages.periodFrom}&nbsp;
                    {format(startDate, 'dd/MM/yyyy')}&nbsp;
                    {messages.periodTo}&nbsp;
                    {format(endDate, 'dd/MM/yyyy')}
                  </SubTitleDetail>
                )}
              </>
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <UICard
            rootProps={{ sx: { height: '125px' } }}
            headerProps={{ sx: { pt: '21px' } }}
            contentProps={{ sx: { pt: 3 } }}
            header={<SubTitle>{pluralize(surveys.count, messages.surveys)}</SubTitle>}
            content={<RatioProgress count={surveys.count} totalCount={surveys.goal} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <UICard
            rootProps={{ sx: { height: '125px' } }}
            contentProps={{ sx: { pt: '25px' } }}
            content={
              <>
                <Score>{calls.count}</Score>
                <SubTitle>
                  {pluralize(calls.count, messages.calls)}&nbsp;
                  {pluralize(calls.count, messages.callsMade)}
                </SubTitle>
                <SubTitleDetail>
                  {messages.callsToRemindPrefix}&nbsp;
                  {calls.toRemind}&nbsp;
                  {messages.callsToRemindSuffix}
                </SubTitleDetail>
              </>
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <UICard
            rootProps={{ sx: { height: '125px' } }}
            contentProps={{ sx: { pt: '25px' } }}
            content={
              <>
                <Score>{secondsToMinutesAndSeconds(averageTime)}</Score>
                <SubTitle>{messages.averageTime}</SubTitle>
                <SubTitleDetail>{messages.averageTimeDetail}</SubTitleDetail>
              </>
            }
          />
        </Grid>
      </Grid>
    </KPIWrapper>
  )
}

CampaignDetailKPI.propTypes = PhoningCampaign.PropTypes

export default CampaignDetailKPI
