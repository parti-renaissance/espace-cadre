import PropTypes from 'prop-types'

import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

import { TruncatedText, VerticalContainer } from 'components/shared/styled'
import { PhoningCampaigns as DomainPhoningCampaigns } from 'domain/phoning'
import RatioProgress from './shared/RatioProgress'
import { chipColorsByStatus } from './CampaignDetail/shared/constants'
import UICard, { UIChip, CtaButton } from 'ui/Card'
import DotsMenu, { DotsMenuItem } from 'ui/Card/Menu/DotsMenu'

const HorizontalContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Date = styled(Typography)`
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

const PhoningCampaign = ({ endDate, title, author, team, score, handleView, handleUpdate }) => {
  const chipLabel = endDate ? messages.finished : messages.ongoing
  const chipColors = chipColorsByStatus?.[endDate ? 'finished' : 'ongoing']

  return (
    <Grid item xs={12} sm={6} md={3} data-testid="UICard">
      <UICard
        rootProps={{ sx: { height: '216px' } }}
        headerProps={{ sx: { pt: '21px' } }}
        header={
          <>
            <div>
              <UIChip label={chipLabel} {...chipColors} sx={{ mr: 1 }} />
              <Date sx={{ color: 'gray600' }}>{format(endDate, 'dd MMMM yyyy', { locale: fr })}</Date>
            </div>
            <VerticalContainer sx={{ pt: 1 }}>
              <TruncatedText variant="subtitle1" title={title}>
                {title}
              </TruncatedText>
              <TruncatedText
                variant="subtitle2"
                title={`${author} • ${team.name} (${team.membersCount})`}
                sx={{ color: 'gray600' }}
              >
                {`${author} • ${team.name} (${team.membersCount})`}
              </TruncatedText>
            </VerticalContainer>
          </>
        }
        contentProps={{ sx: { pt: 3 } }}
        content={<RatioProgress count={score.count} totalCount={score.goal} />}
        actionsProps={{ sx: { pt: 2 } }}
        actions={
          <HorizontalContainer>
            <CtaButton
              onClick={handleView}
              sx={{
                color: 'indigo700',
                '&:hover': {
                  bgcolor: 'phoning.background.hover',
                },
              }}
            >
              {messages.see}
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

PhoningCampaign.propTypes = {
  ...DomainPhoningCampaigns.PropTypes,
  handleView: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
}

export default PhoningCampaign
