import { Grid, Paper, Typography } from '@mui/material'
import { styled } from '@mui/system'

import pluralize from 'components/shared/pluralize/pluralize'
import PhoningCampaign from 'domain/phoning-campaign'
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
  campaign: 'Campagne',
  ongoingCampaignPrefix: 'Dont',
  ongoingCampaignSuffix: 'en cours',
  survey: 'Questionnaire',
  surveyOnAMonth: 'sur un mois',
  call: 'Appel',
  callOnAMonth: 'sur un mois',
}

const GlobalCampaignsKPI = ({ campaigns, surveys, calls }) => (
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
              <Score>{campaigns.count}</Score>
              <SubTitle>{pluralize(campaigns.count, messages.campaign)}</SubTitle>
              <SubTitleDetail>
                {messages.ongoingCampaignPrefix}&nbsp;
                {campaigns.ongoing}&nbsp;
                {messages.ongoingCampaignSuffix}
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
              <Score>{surveys.count}</Score>
              <SubTitle>{pluralize(surveys.count, messages.survey)}</SubTitle>
              <SubTitleDetail>
                {surveys.onAMonth}&nbsp;
                {messages.surveyOnAMonth}
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
              <Score>{calls.count}</Score>
              <SubTitle>{pluralize(calls.count, messages.call)}</SubTitle>
              <SubTitleDetail>
                {calls.onAMonth}&nbsp;
                {messages.callOnAMonth}
              </SubTitleDetail>
            </>
          }
        />
      </Grid>
    </Grid>
  </KPIWrapper>
)

GlobalCampaignsKPI.propTypes = PhoningCampaign.PropTypes

export default GlobalCampaignsKPI
