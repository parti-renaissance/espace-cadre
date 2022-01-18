import PropTypes from 'prop-types'

import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { format, isBefore } from 'date-fns'
import { fr } from 'date-fns/locale'

import { TruncatedText, VerticalContainer } from 'components/shared/styled'
import { PhoningCampaignItem as DomainPhoningCampaignItem } from 'domain/phoning'
import RatioProgress from 'ui/RatioProgress/RatioProgress'
import { chipColorsByStatus } from '../CampaignDetail/shared/constants'
import UICard, { UIChip, CtaButton } from 'ui/Card'
import DotsMenu, { DotsMenuItem } from 'ui/Card/Menu/DotsMenu'

const HorizontalContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const EndDate = styled(Typography)`
  font-size: 10px;
  font-weight: 400;
  line-height: 15px;
`

const messages = {
  see: 'voir',
  contact: 'contact',
  edit: 'modifier',
  finished: 'Terminé',
  ongoing: 'En cours',
}

const CampaignItem = ({ endDate, title, author, team, score, handleView, handleUpdate }) => {
  const chipLabel = isBefore(new Date(), endDate) ? messages.ongoing : messages.finished
  const chipColors = chipColorsByStatus?.[isBefore(new Date(), endDate) ? 'ongoing' : 'finished']

  return (
    <Grid item xs={12} sm={6} md={3}>
      <UICard
        rootProps={{ sx: { height: '216px' } }}
        headerProps={{ sx: { pt: '21px' } }}
        header={
          <>
            <div>
              <UIChip label={chipLabel} {...chipColors} sx={{ mr: 1 }} />
              <EndDate sx={{ color: 'gray600' }} data-cy="phoning-campaigns-item-end-date">
                {format(endDate, 'dd MMMM yyyy', { locale: fr })}
              </EndDate>
            </div>
            <VerticalContainer sx={{ pt: 1 }}>
              <TruncatedText variant="subtitle1" title={title} data-cy="phoning-campaigns-item-title">
                {title}
              </TruncatedText>
              <TruncatedText
                variant="subtitle2"
                title={`${author} • ${team.name} (${team.membersCount})`}
                data-cy="phoning-campaigns-item-description"
                sx={{ color: 'gray600' }}
              >
                {`${author} • ${team.name} (${team.membersCount})`}
              </TruncatedText>
            </VerticalContainer>
          </>
        }
        contentProps={{ sx: { pt: 3 } }}
        content={<RatioProgress count={score.count} totalCount={score.globalGoal} />}
        actionsProps={{ sx: { pt: 2 } }}
        actions={
          <HorizontalContainer>
            <CtaButton
              data-cy="phoning-action-view"
              onClick={handleView}
              sx={{
                color: 'campaign.color',
                '&:hover': {
                  bgcolor: 'campaign.background.hover',
                },
              }}
            >
              <Typography variant="button" sx={{ textTransform: 'uppercase' }}>
                {messages.see}
              </Typography>
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
