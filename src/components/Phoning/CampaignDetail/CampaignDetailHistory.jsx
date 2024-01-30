import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

import {
  PhoningCampaignDetailHistoryAdherent as DomainPhoningCampaignDetailHistoryAdherent,
  PhoningCampaignDetailHistoryCaller as DomainPhoningCampaignDetailHistoryCaller,
} from '~/domain/phoning'
import { chipColorsByStatus, chipLabelByStatus, defaultChipColor, translatedGender } from './shared/constants'
import { TruncatedText, VerticalContainer } from '~/components/shared/styled'
import UICard, { UIChip } from '~/ui/Card'
import { formatDate } from '~/shared/helpers'

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
  deletedAdherent: 'Compte supprimé',
  see: 'voir',
}

const CampaignDetailHistory = ({ status, startDate, adherent, caller }) => {
  const chipLabel = chipLabelByStatus?.[status]
  const chipColors = chipColorsByStatus?.[status] || defaultChipColor
  const gender = adherent ? translatedGender[adherent.gender] : null

  return (
    <Grid item xs={12} sm={6} md={3} data-cy="phoning-campaign-detail-history">
      <UICard
        rootProps={{ sx: { height: '168px' } }}
        headerProps={{ sx: { pt: '21px' } }}
        header={
          <>
            {adherent && (
              <>
                <TruncatedText variant="subtitle1" title={`${adherent.firstName} ${adherent.lastName}`}>
                  {adherent.firstName} {adherent.lastName}
                </TruncatedText>
                <Typography variant="subtitle2" sx={{ color: 'gray600' }}>
                  {gender && `${gender}, `}
                  {adherent.age && `${adherent.age} ${messages.years}`}
                </Typography>
              </>
            )}
            {!adherent && (
              <Typography variant="subtitle1" sx={{ color: 'gray900', opacity: 0.5 }}>
                {messages.deletedAdherent}
              </Typography>
            )}
          </>
        }
        contentProps={{ sx: { pt: adherent ? 1 : 3 } }}
        content={
          <>
            <div>
              <UIChip label={chipLabel} {...chipColors} />
            </div>
            <VerticalContainer sx={{ py: 2 }}>
              <Author sx={{ pb: 0.5 }}>
                {caller.firstName} {caller.lastName}
              </Author>
              <UpdateTime>{formatDate(startDate, 'dd/MM/yyyy hh:mm')}</UpdateTime>
            </VerticalContainer>
          </>
        }
      />
    </Grid>
  )
}

CampaignDetailHistory.propTypes = {
  status: PropTypes.string.isRequired,
  startDate: PropTypes.object.isRequired,
  adherent: PropTypes.shape(DomainPhoningCampaignDetailHistoryAdherent.propTypes),
  caller: PropTypes.shape(DomainPhoningCampaignDetailHistoryCaller.propTypes),
}

export default CampaignDetailHistory
