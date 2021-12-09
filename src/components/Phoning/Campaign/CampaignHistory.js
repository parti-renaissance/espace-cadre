import { Box, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { format } from 'date-fns'

import { chipColorsByStatus, chipLabelByStatus, defaultChipColor, translatedGender } from './shared/constants'
import { TruncatedText } from './shared/components'
import DomainPhoningCampaignHistory from 'domain/phoning-campaign-history'
import { CtaButton } from 'ui/Card'
import UICard from 'ui/Card/Card'
import { Chip as UIChip } from 'ui/Card/Chip/Chip'

const AuhthorContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`
const Author = styled(TruncatedText)`
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
`
const UpdateTime = styled(Typography)`
  font-size: 10px;
  font-weight: 400;
  line-height: 18px;
`

const messages = {
  years: 'ans',
  see: 'voir',
}

const PhoningCampaignHistory = ({ status, startDate, adherent, caller, handleClick }) => {
  const chipLabel = chipLabelByStatus[status]
  const chipColors = chipColorsByStatus?.[status] || defaultChipColor
  const gender = translatedGender[adherent.gender]
  return (
    <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
      <UICard
        rootProps={{ sx: { height: '205px' } }}
        headerProps={{ sx: { pt: '21px' } }}
        header={
          <>
            <TruncatedText variant="subtitle1" title={`${adherent.firstName} ${adherent.lastName}`}>
              {adherent.firstName} {adherent.lastName}
            </TruncatedText>
            <Typography variant="subtitle2" sx={{ color: 'gray600' }}>
              {gender && `${gender}, `}
              {adherent.age && `${adherent.age} ${messages.years}`}
            </Typography>
          </>
        }
        contentProps={{ sx: { pt: 1 } }}
        content={
          <>
            <Box>
              <UIChip label={chipLabel} {...chipColors} />
            </Box>
            <AuhthorContainer sx={{ py: 2 }}>
              <Author sx={{ pb: 0.5 }}>
                {caller.firstName} {caller.lastName}
              </Author>
              <UpdateTime>{format(new Date(startDate), 'dd/MM/yyyy hh:mm')}</UpdateTime>
            </AuhthorContainer>
          </>
        }
        actions={
          <CtaButton
            onClick={handleClick}
            sx={{
              color: 'indigo700',
              '&:hover': {
                bgcolor: 'phoning.background.hover',
              },
            }}
          >
            {messages.see}
          </CtaButton>
        }
      />
    </Grid>
  )
}

PhoningCampaignHistory.propTypes = DomainPhoningCampaignHistory.PropTypes

export default PhoningCampaignHistory
