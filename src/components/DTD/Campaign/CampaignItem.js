import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

import { TruncatedText, VerticalContainer } from 'components/shared/styled'
import { DTDCampaignItem as DomainDTDCampaignItem } from 'domain/DTD'
import RatioProgress from 'ui/RatioProgress/RatioProgress'
import { chipColorsByDate, chipLabelByDate } from '../CampaignDetail/shared/helpers'
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
}

const DTDCampaignItem = ({ startDate, endDate, title, score, handleView }) => {
  const chipLabel = chipLabelByDate(startDate, endDate)
  const chipColors = chipColorsByDate(startDate, endDate)

  return (
    <Grid item xs={12} sm={6} md={3}>
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
                color: 'main',
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

DTDCampaignItem.propTypes = {
  ...DomainDTDCampaignItem.propTypes,
  handleView: PropTypes.func.isRequired,
}

export default DTDCampaignItem
