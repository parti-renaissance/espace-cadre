import PropTypes from 'prop-types'
import { Grid, Typography as MuiTypography, Divider } from '@mui/material'
import { styled } from '@mui/system'
import { format, isBefore } from 'date-fns'
import { fr } from 'date-fns/locale'

import { TruncatedText, VerticalContainer } from 'components/shared/styled'
import { chipColorsByDate, chipLabelByDate } from '../Campaign/shared/helpers'
import UICard, { UIChip, CtaButton } from 'ui/Card'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import pluralize from '../../shared/pluralize/pluralize'
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded'
import DateStatus from './DateStatus'

const HorizontalContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Typography = styled(MuiTypography)`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.palette.gray600};
`

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
}

const DTDCampaignItem = ({
  startDate,
  endDate,
  title,
  author,
  voters,
  pollingStations,
  knockedDoors,
  filledSurveys,
  collectedContacts,
  handleView,
}) => {
  const chipLabel = chipLabelByDate(startDate, endDate)
  const chipColors = chipColorsByDate(startDate, endDate)
  return (
    <Grid item xs={12} sm={6} md={3}>
      <UICard
        rootProps={{ sx: { height: '290px' } }}
        headerProps={{ sx: { pt: '21px' } }}
        header={
          <>
            <div>
              <UIChip label={chipLabel} {...chipColors} sx={{ mr: 1 }} />
            </div>
            <VerticalContainer sx={{ pt: 1 }}>
              <TruncatedText variant="subtitle1" title={title} lines={2} data-cy="DTD-campaigns-item-title">
                {title}
              </TruncatedText>
            </VerticalContainer>
            <Grid container alignItems="center">
              <PersonRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5 }} />
              <Typography>{author}</Typography>
            </Grid>
            <Grid container alignItems="center" sx={{ mb: 1 }}>
              <AccessTimeRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5 }} />
              <Typography>
                <DateStatus startDate={startDate} endDate={endDate} />
              </Typography>
            </Grid>
            <Divider sx={{ color: 'rgba(0, 0, 0, 0.16)' }} />
          </>
        }
        contentProps={{ sx: { pt: 1 } }}
        content={
          <>
            <Grid container alignItems="center" sx={{ mb: 0.5 }}>
              <PeopleRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5 }} />
              <Typography>
                <Typography sx={{ fontWeight: 700 }}>{voters}&nbsp;</Typography>
                {pluralize(voters, messages.voters)}&nbsp;
                {pluralize(voters, messages.targeted)}
              </Typography>
              <Typography>
                <PeopleRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5, visibility: 'hidden' }} />
                <Typography sx={{ fontWeight: 700 }}>{pollingStations}&nbsp;</Typography>
                {pluralize(pollingStations, messages.pollingStation, 'x')}&nbsp;
                {messages.voice}
              </Typography>
            </Grid>
            <Grid container alignItems="center">
              <Typography>
                <WhatshotRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5 }} />
                <Typography sx={{ fontWeight: 700 }}>{knockedDoors}&nbsp;</Typography>
                {pluralize(knockedDoors, messages.door)}&nbsp;
                {pluralize(knockedDoors, messages.knocked)}
              </Typography>
              <Typography>
                <WhatshotRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5, visibility: 'hidden' }} />
                <Typography sx={{ fontWeight: 700 }}>{filledSurveys}&nbsp;</Typography>
                {pluralize(filledSurveys, messages.survey)}&nbsp;
                {pluralize(filledSurveys, messages.filled)}
              </Typography>
              <Typography>
                <WhatshotRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5, visibility: 'hidden' }} />
                <Typography sx={{ fontWeight: 700 }}>{collectedContacts}&nbsp;</Typography>
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
  title: PropTypes.string,
  author: PropTypes.string,
  voters: PropTypes.number,
  pollingStations: PropTypes.number,
  knockedDoors: PropTypes.number,
  filledSurveys: PropTypes.number,
  collectedContacts: PropTypes.number,
  handleView: PropTypes.func,
}
