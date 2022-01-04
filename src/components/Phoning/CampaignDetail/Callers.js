import PropTypes from 'prop-types'
import { Grid } from '@mui/material'

import { PhoningCampaignCallers as DomainPhoningCampaignCallers } from 'domain/phoning'
import { TruncatedText } from 'components/shared/styled'
import RatioProgress from '../shared/RatioProgress'
import UICard from 'ui/Card/Card'

const CampaignDetailCallers = ({ number, firstName, lastName, count, goal }) => (
  <Grid item xs={12} sm={6} md={3} data-cy="phoning-campaign-detail-callers">
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

CampaignDetailCallers.propTypes = {
  number: PropTypes.number.isRequired,
  ...DomainPhoningCampaignCallers.propTypes,
  goal: PropTypes.number,
}

export default CampaignDetailCallers
