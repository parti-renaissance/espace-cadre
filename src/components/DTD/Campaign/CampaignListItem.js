import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { format, isBefore } from 'date-fns'
import { fr } from 'date-fns/locale'

import { TruncatedText, VerticalContainer } from 'components/shared/styled'
import { DTDCampaignListItem as DomainDTDCampaignListItem } from 'domain/DTD'
import RatioProgress from 'ui/RatioProgress/RatioProgress'
import { chipColorsByStatus } from '../CampaignDetail/shared/constants'
import UICard, { UIChip, CtaButton } from 'ui/Card'

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

const DTDCampaignListItem = ({ endDate, title, score, handleView }) => {
  const chipLabel = isBefore(new Date(), endDate) ? messages.ongoing : messages.finished
  const chipColors = chipColorsByStatus?.[isBefore(new Date(), endDate) ? 'ongoing' : 'finished']

  return (
    <Grid item xs={12} sm={6} md={3} data-testid="UICard">
      <UICard
        rootProps={{ sx: { height: '198px' } }}
        headerProps={{ sx: { pt: '21px' } }}
        header={
          <>
            <div>
              <UIChip label={chipLabel} {...chipColors} sx={{ mr: 1 }} />
              <EndDate sx={{ color: 'gray600' }}>{format(endDate, 'dd MMMM yyyy', { locale: fr })}</EndDate>
            </div>
            <VerticalContainer sx={{ pt: 1 }}>
              <TruncatedText variant="subtitle1" title={title}>
                {title}
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
              data-cy="DTD-action-view"
              onClick={handleView}
              sx={{
                color: 'campaign.color',
                '&:hover': {
                  bgcolor: 'campaign.background.hover',
                },
              }}
            >
              {messages.see}
            </CtaButton>
          </HorizontalContainer>
        }
      />
    </Grid>
  )
}

DTDCampaignListItem.propTypes = {
  ...DomainDTDCampaignListItem.propTypes,
  handleView: PropTypes.func.isRequired,
}

export default DTDCampaignListItem
