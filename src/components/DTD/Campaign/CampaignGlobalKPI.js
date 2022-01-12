import { Grid, Paper, Typography } from '@mui/material'
import { styled } from '@mui/system'

import { DTDGlobalKPI as DomainDTDGlobalKPI } from 'domain/DTD'
import pluralize from 'components/shared/pluralize/pluralize'
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
  color: ${theme.palette.campaign.background.ratio.current};
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
  knocked: 'Porte',
  door: 'frappée',
  knockedDoorOnAMonth: 'sur un mois',
}

const DTDGlobalKPI = ({ campaigns, surveys, doors }) => (
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
              <Score>{doors.count}</Score>
              <SubTitle>
                {pluralize(doors.count, messages.knocked)}&nbsp;
                {pluralize(doors.count, messages.door)}
              </SubTitle>
              <SubTitleDetail>
                {doors.onAMonth}&nbsp;
                {messages.knockedDoorOnAMonth}
              </SubTitleDetail>
            </>
          }
        />
      </Grid>
    </Grid>
  </KPIWrapper>
)

DTDGlobalKPI.propTypes = DomainDTDGlobalKPI.propTypes

export default DTDGlobalKPI
