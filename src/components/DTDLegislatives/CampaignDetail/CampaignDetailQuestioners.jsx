import PropTypes from 'prop-types'
import { Grid } from '@mui/material'

import { DTDCampaignDetailQuestioner as DomainDTDCampaignDetailQuestioner } from '~/domain/DTD'
import { TruncatedText } from '~/components/shared/styled'
import RatioProgress from '~/ui/RatioProgress/RatioProgress'
import UICard from '~/ui/Card'

const CampaignDetailQuestioner = ({ number, firstName, lastName, count, goal }) => (
  <Grid item xs={12} sm={6} md={3} data-cy="DTD-campaign-detail-questioners">
    <UICard
      rootProps={{ sx: { height: '125px' } }}
      headerProps={{ sx: { pt: '21px' } }}
      header={
        <TruncatedText variant="subtitle1" sx={{ color: 'gray900' }} title={`${firstName} ${lastName}`}>
          {number}. {firstName} {lastName}
        </TruncatedText>
      }
      contentProps={{ sx: { pt: 3 } }}
      content={goal && <RatioProgress count={count} totalCount={goal} />}
    />
  </Grid>
)

CampaignDetailQuestioner.propTypes = {
  number: PropTypes.number.isRequired,
  ...DomainDTDCampaignDetailQuestioner.propTypes,
  goal: PropTypes.number,
}

export default CampaignDetailQuestioner
