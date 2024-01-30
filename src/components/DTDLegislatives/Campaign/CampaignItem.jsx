import PropTypes from 'prop-types'
import { Grid, Typography as MuiTypography, Divider } from '@mui/material'
import { styled } from '@mui/system'

import { TruncatedText, VerticalContainer } from '~/components/shared/styled'
import { chipColorsByDate, chipLabelByDate } from '../Campaign/shared/helpers'
import UICard, { UIChip, CtaButton } from '~/ui/Card'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import pluralize from '../../shared/pluralize/pluralize'
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded'
import DateStatus from './DateStatus'
import formatNumber from '~/components/shared/formatNumber/formatNumber'
import DotsMenu, { DotsMenuItem } from '~/ui/Card/Menu/DotsMenu'
import { isBefore, isAfter } from 'date-fns'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'

const HorizontalContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const IconContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
`

const Typography = styled(MuiTypography)`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.palette.gray600};
`

const NotificationsOnIcon = styled(NotificationsActiveRoundedIcon)(
  ({ theme }) => `
  font-size: 16px;
  font-weight: 500;
  border-radius: 19px;
  padding: ${theme.spacing(0.25)};
  border-color: ${theme.palette.gray100};
  border: ${`1px solid ${theme.palette.gray200}`};
  margin: ${theme.spacing(0.25, 1, 0, 1)};
`
)

const NotificationsOffIcon = styled(NotificationsOffRoundedIcon)(
  ({ theme }) => `
  font-size: 16px;
  font-weight: 500;
  border-radius: 19px;
  padding: ${theme.spacing(0.25)};
  border-color: ${theme.palette.gray100};
  border: ${`1px solid ${theme.palette.gray200}`};
  margin: ${theme.spacing(0.25, 0, 0, 1)};
`
)

const messages = {
  see: 'voir',
  contact: 'contact',
  edit: 'modifier',
  voters: 'électeur',
  targeted: 'ciblé',
  pollingStation: 'bureau',
  voice: 'de vote',
  door: 'porte',
  knocked: 'frappée',
  survey: 'questionnaire',
  filled: 'rempli',
  collected: 'collecté',
  delete: 'Supprimer',
  publish: 'Publier',
  unpublish: 'Dépublier',
}

const DTDCampaignItem = ({
  startDate,
  endDate,
  title,
  voters,
  knockedDoors,
  author,
  count,
  pollingStations,
  collectedContacts,
  handleView,
  handleDelete,
  handlePublish,
  isPublished,
}) => {
  const chipLabel = chipLabelByDate(startDate, endDate)
  const chipColors = chipColorsByDate(startDate, endDate)
  const today = new Date()
  const isCampaignToCome = isBefore(today, startDate)
  const isCampaignInProgress = isAfter(today, startDate) && isBefore(today, endDate)

  return (
    <Grid item xs={12} sm={6} md={3}>
      <UICard
        rootProps={{ sx: { height: '290px' } }}
        headerProps={{ sx: { pt: '21px' } }}
        header={
          <>
            <HorizontalContainer>
              <IconContainer>
                <UIChip label={chipLabel} {...chipColors} sx={{ mr: 1 }} />
                {isPublished ? <NotificationsOnIcon /> : <NotificationsOffIcon />}
              </IconContainer>
            </HorizontalContainer>
            <VerticalContainer sx={{ pt: 1 }}>
              <TruncatedText variant="subtitle1" title={title} lines={2} data-cy="DTD-campaigns-item-title">
                {title}
              </TruncatedText>
            </VerticalContainer>
            <Grid container alignItems="center">
              <PersonRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5 }} />
              <Typography>{author}</Typography>
            </Grid>
            <Grid container alignItems="center">
              <AccessTimeRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5 }} />
              <Typography>
                <DateStatus startDate={startDate} endDate={endDate} />
              </Typography>
            </Grid>
          </>
        }
        contentProps={{ sx: { pt: 1 } }}
        content={
          <>
            <Divider sx={{ color: 'rgba(0, 0, 0, 0.16)', mb: 1 }} />
            <Grid container alignItems="center" sx={{ mb: 0.5 }}>
              <PeopleRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5 }} />
              <Typography>
                <Typography sx={{ fontWeight: 700 }}>{formatNumber(voters)}&nbsp;</Typography>
                {pluralize(voters, messages.voters)}&nbsp;
                {pluralize(voters, messages.targeted)}
              </Typography>
              <Typography>
                <PeopleRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5, visibility: 'hidden' }} />
                <Typography sx={{ fontWeight: 700 }}>{formatNumber(pollingStations)}&nbsp;</Typography>
                {pluralize(pollingStations, messages.pollingStation, 'x')}&nbsp;
                {messages.voice}
              </Typography>
            </Grid>
            <Grid container alignItems="center">
              <Typography>
                <WhatshotRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5 }} />
                <Typography sx={{ fontWeight: 700 }}>{formatNumber(knockedDoors)}&nbsp;</Typography>
                {pluralize(knockedDoors, messages.door)}&nbsp;
                {pluralize(knockedDoors, messages.knocked)}
              </Typography>
              <Typography>
                <WhatshotRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5, visibility: 'hidden' }} />
                <Typography sx={{ fontWeight: 700 }}>{formatNumber(count)}&nbsp;</Typography>
                {pluralize(count, messages.survey)}&nbsp;
                {pluralize(count, messages.filled)}
              </Typography>
              <Typography>
                <WhatshotRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5, visibility: 'hidden' }} />
                <Typography sx={{ fontWeight: 700 }}>{formatNumber(collectedContacts)}&nbsp;</Typography>
                {pluralize(collectedContacts, messages.contact)}&nbsp;
                {pluralize(collectedContacts, messages.collected)}
              </Typography>
            </Grid>
          </>
        }
        actionsProps={{ sx: { pt: 2 } }}
        actions={
          <HorizontalContainer>
            <CtaButton
              data-cy="DTD-action-view"
              onClick={handleView}
              sx={{
                color: 'main',
                '&:hover': {
                  bgcolor: 'campaign.background.hover',
                },
              }}
            >
              <MuiTypography variant="button" sx={{ textTransform: 'uppercase' }}>
                {messages.see}
              </MuiTypography>
            </CtaButton>
            {(isCampaignInProgress || isCampaignToCome) && (
              <DotsMenu>
                {isCampaignInProgress && (
                  <DotsMenuItem onClick={handlePublish}>
                    {isPublished ? messages.unpublish : messages.publish}
                  </DotsMenuItem>
                )}
                {isCampaignToCome && <DotsMenuItem onClick={() => handleDelete()}>{messages.delete}</DotsMenuItem>}
              </DotsMenu>
            )}
          </HorizontalContainer>
        }
      />
    </Grid>
  )
}

export default DTDCampaignItem

DTDCampaignItem.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  author: PropTypes.string,
  title: PropTypes.string,
  voters: PropTypes.number,
  knockedDoors: PropTypes.number,
  collectedContacts: PropTypes.number,
  count: PropTypes.number,
  pollingStations: PropTypes.number,
  handleView: PropTypes.func,
  handleDelete: PropTypes.func,
  handlePublish: PropTypes.func,
  isPublished: PropTypes.bool.isRequired,
}
