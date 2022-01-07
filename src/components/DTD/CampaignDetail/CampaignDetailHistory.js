import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { format } from 'date-fns'

import { DTDCampaignDetailHistory as DomainDTDCampaignDetailHistory } from 'domain/DTD'
import { chipColorsByStatus, chipLabelByStatus, defaultChipColor } from './shared/constants'
import { secondsToMinutes } from './shared/helpers'
import { TruncatedText, VerticalContainer } from 'components/shared/styled'
import UICard, { UIChip, CtaButton } from 'ui/Card'

const Questioner = styled(TruncatedText)`
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
  block: 'Batiment',
  floor: 'étage',
  door: 'porte',
}

const formattedAddress = ({ number, street, postCode, city }) =>
  `${number}${number && ' '}${street}${(postCode || city) && ','}`
const formattedBuilding = ({ block, floor, door }) =>
  `${block && `${messages.block} ${block}`}${floor && ', '}
  ${floor && `${messages.floor} ${floor}`}${door && ', '}
  ${door && `${messages.door} ${door}`}`

const CampaignDetailHistory = ({ status, address, questioner, startDate, duration, handleView }) => {
  const chipLabel = chipLabelByStatus?.[status]
  const chipColors = chipColorsByStatus?.[status] || defaultChipColor
  const durationInMinutes = secondsToMinutes(duration)
  return (
    <Grid item xs={12} sm={6} md={3} data-cy="DTD-campaign-detail-history">
      <UICard
        rootProps={{ sx: { height: '230px' } }}
        headerProps={{ sx: { pt: '21px' } }}
        header={
          <>
            <TruncatedText variant="subtitle1" title={`${address.number} ${address.street}`}>
              {formattedAddress(address)}
            </TruncatedText>
            <TruncatedText variant="subtitle1">
              {address.postCode}&nbsp;{address.city}
            </TruncatedText>
            <Typography variant="subtitle2" sx={{ color: 'gray600' }}>
              {formattedBuilding(address)}
            </Typography>
          </>
        }
        contentProps={{ sx: { pt: questioner ? 1 : 3 } }}
        content={
          <>
            <div>
              <UIChip label={chipLabel} {...chipColors} />
            </div>
            <VerticalContainer sx={{ py: 2 }}>
              <Questioner sx={{ pb: 0.5, color: 'gray700' }}>
                {questioner.firstName} {questioner.lastName}
              </Questioner>
              <UpdateTime sx={{ color: 'gray600' }}>
                {format(startDate, 'dd/MM/yyyy hh:mm')}
                {durationInMinutes && ' • '}
                {durationInMinutes}
              </UpdateTime>
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
                  bgcolor: 'campaign.background.hover',
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
  ...DomainDTDCampaignDetailHistory.propTypes,
  handleView: PropTypes.func.isRequired,
}

export default CampaignDetailHistory
