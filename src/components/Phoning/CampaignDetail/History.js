import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { format } from 'date-fns'

import { PhoningCampaignHistoryAdherent, PhoningCampaignHistoryCaller } from 'domain/phoning'
import { chipColorsByStatus, chipLabelByStatus, defaultChipColor, translatedGender } from './shared/constants'
import { TruncatedText, VerticalContainer } from 'components/shared/styled'
import UICard, { UIChip, CtaButton } from 'ui/Card'

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

const CampaignDetailHistory = ({ status, startDate, adherent, caller, handleView }) => {
  const chipLabel = chipLabelByStatus?.[status]
  const chipColors = chipColorsByStatus?.[status] || defaultChipColor
  const gender = translatedGender?.[adherent.gender]
  return (
    <Grid item xs={12} sm={6} md={3}>
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
            <div>
              <UIChip label={chipLabel} {...chipColors} />
            </div>
            <VerticalContainer sx={{ py: 2 }}>
              <Author sx={{ pb: 0.5 }}>
                {caller.firstName} {caller.lastName}
              </Author>
              <UpdateTime>{format(startDate, 'dd/MM/yyyy hh:mm')}</UpdateTime>
            </VerticalContainer>
          </>
        }
        actions={
          <div>
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
          </div>
        }
      />
    </Grid>
  )
}

CampaignDetailHistory.propTypes = {
  status: PropTypes.string.isRequired,
  startDate: PropTypes.object.isRequired,
  adherent: PhoningCampaignHistoryAdherent.propTypes,
  caller: PhoningCampaignHistoryCaller.propTypes,
  handleView: PropTypes.func.isRequired,
}

export default CampaignDetailHistory
