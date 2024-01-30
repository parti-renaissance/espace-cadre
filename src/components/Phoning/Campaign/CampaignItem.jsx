import PropTypes from 'prop-types'

import { Grid, Typography as MuiTypography, Divider, Box } from '@mui/material'
import { styled } from '@mui/system'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded'
import pluralize from '../../shared/pluralize/pluralize'
import formatNumber from '~/components/shared/formatNumber/formatNumber'
import { isBefore } from 'date-fns'

import { TruncatedText, VerticalContainer } from '~/components/shared/styled'
import { PhoningCampaignItem as DomainPhoningCampaignItem } from '~/domain/phoning'
import { chipColorsByStatus } from '../CampaignDetail/shared/constants'
import UICard, { UIChip, CtaButton } from '~/ui/Card'
import DotsMenu, { DotsMenuItem } from '~/ui/Card/Menu/DotsMenu'
import { formatDate } from '~/shared/helpers'

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
  finished: 'Terminé',
  ongoing: 'En cours',
  people: 'personne',
  calls: 'appel',
  toCall: 'à appeler',
  called: 'appelées',
  callsMade: 'passés',
}

const CampaignItem = ({
  endDate,
  title,
  author,
  team,
  handleView,
  handleUpdate,
  numberOfCalls,
  numberOfUsersCalled,
  numberOfUsersToBeCalled,
}) => {
  const chipLabel = isBefore(new Date(), endDate) ? messages.ongoing : messages.finished
  const chipColors = chipColorsByStatus?.[isBefore(new Date(), endDate) ? 'ongoing' : 'finished']
  return (
    <Grid item xs={12} sm={6} md={3}>
      <UICard
        rootProps={{ sx: { height: '280px' } }}
        headerProps={{ sx: { pt: '21px' } }}
        header={
          <>
            <div>
              <UIChip label={chipLabel} {...chipColors} sx={{ mr: 1 }} />
            </div>
            <VerticalContainer sx={{ pt: 1 }}>
              <TruncatedText variant="subtitle1" title={title} lines={2} data-cy="phoning-campaigns-item-title">
                {title}
              </TruncatedText>
            </VerticalContainer>
            <Grid container alignItems="center">
              <PersonRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5 }} />
              <Typography data-cy="phoning-campaigns-item-author">{author}</Typography>
            </Grid>
            <Grid container alignItems="center">
              <AccessTimeRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5 }} />
              <Typography data-cy="phoning-campaigns-item-end-date">{formatDate(endDate, 'dd MMMM yyyy')}</Typography>
            </Grid>
            <Grid container alignItems="center">
              <Typography>{team.name}</Typography>
            </Grid>
          </>
        }
        contentProps={{ sx: { pt: 1 } }}
        content={
          <>
            <Divider sx={{ color: 'rgba(0, 0, 0, 0.16)', mb: 1 }} />
            <Box container sx={{ mb: 0.5 }}>
              <Box display="flex" alignItems="center">
                <WhatshotRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5 }} />
                <Typography sx={{ fontWeight: 700 }}>{formatNumber(numberOfUsersToBeCalled)}&nbsp;</Typography>
                {pluralize(numberOfUsersToBeCalled, messages.people, 's')}&nbsp;
                {messages.toCall}
              </Box>
              <Box display="flex" alignItems="center">
                <WhatshotRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5, visibility: 'hidden' }} />
                <Typography sx={{ fontWeight: 700 }}>{formatNumber(numberOfUsersCalled)}&nbsp;</Typography>
                {pluralize(numberOfUsersCalled, messages.people, 's')}&nbsp;
                {messages.called}
              </Box>
              <Box display="flex" alignItems="center">
                <PeopleRoundedIcon sx={{ fontSize: '12px', color: 'gray500', mr: 0.5, visibility: 'hidden' }} />
                <Typography sx={{ fontWeight: 700 }}>{formatNumber(numberOfCalls)}&nbsp;</Typography>
                {pluralize(numberOfCalls, messages.calls, 's')}&nbsp;
                {messages.callsMade}
              </Box>
            </Box>
          </>
        }
        actionsProps={{ sx: { pt: 2 } }}
        actions={
          <HorizontalContainer>
            <CtaButton
              data-cy="phoning-action-view"
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
            <DotsMenu>
              <DotsMenuItem onClick={handleUpdate}>{messages.edit}</DotsMenuItem>
            </DotsMenu>
          </HorizontalContainer>
        }
      />
    </Grid>
  )
}

CampaignItem.propTypes = {
  ...DomainPhoningCampaignItem.propTypes,
  handleView: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
}

export default CampaignItem
