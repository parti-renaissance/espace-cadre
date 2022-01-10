import { Grid, Paper, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { differenceInCalendarDays, format } from 'date-fns'

import pluralize from 'components/shared/pluralize/pluralize'
import { DTDCampaignDetailKPI as DomainDTDCampaignDetailKPI } from 'domain/DTD'
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
  day: 'Jour',
  remaining: 'restant',
  periodFrom: 'Du',
  periodTo: 'au',
  surveys: 'Questionnaire',
  doors: 'Porte',
  doorsKnocked: 'frappée',
  doorsToRemindPrefix: 'Dont',
  doorsToRemindSuffix: 'ouverte',
  contacts: 'Contact',
  contactsCollected: 'collecté',
  contactsInvitation: 'invitation',
  contactsToJoin: 'à adhérer',
}

const CampaignDetailKPI = ({ remaining, surveys, doors, contacts }) => {
  const daysRemaining = differenceInCalendarDays(remaining.endDate, new Date()) || 0

  return (
    <KPIWrapper data-cy="DTD-campaign-detail-KPI">
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
                {remaining.startDate && remaining.endDate && (
                  <SubTitleDetail>
                    {messages.periodFrom}&nbsp;
                    {format(remaining.startDate, 'dd/MM/yyyy')}&nbsp;
                    {messages.periodTo}&nbsp;
                    {format(remaining.endDate, 'dd/MM/yyyy')}
                  </SubTitleDetail>
                )}
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
                <Score>{surveys.count <= 0 ? 0 : surveys.count}</Score>
                <SubTitle>{pluralize(surveys.count, messages.surveys)}</SubTitle>
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
                <Score>{doors.knockedCount}</Score>
                <SubTitle>
                  {pluralize(doors.knockedCount, messages.doors)}&nbsp;
                  {pluralize(doors.knockedCount, messages.doorsKnocked)}
                </SubTitle>
                {Number.isInteger(doors.openCount) && (
                  <SubTitleDetail>
                    {messages.doorsToRemindPrefix}&nbsp;
                    {doors.openCount}&nbsp;
                    {pluralize(doors.openCount, messages.doorsToRemindSuffix)}
                  </SubTitleDetail>
                )}
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
                <Score>{contacts.collectedCount}</Score>
                <SubTitle>
                  {pluralize(contacts.collectedCount, messages.contacts)}&nbsp;
                  {pluralize(contacts.collectedCount, messages.contactsCollected)}
                </SubTitle>
                {contacts.toJoinCount && (
                  <SubTitleDetail>
                    {contacts.toJoinCount}&nbsp;
                    {pluralize(contacts.toJoinCount, messages.contactsInvitation)}&nbsp;
                    {messages.contactsToJoin}
                  </SubTitleDetail>
                )}
              </>
            }
          />
        </Grid>
      </Grid>
    </KPIWrapper>
  )
}

CampaignDetailKPI.propTypes = DomainDTDCampaignDetailKPI.propTypes

export default CampaignDetailKPI
