import { Grid } from '@mui/material'

import UICard from 'ui/Card/Card'
import { TruncatedText } from './shared/components'
import DomainPhoningCampaignCallers from 'domain/phoning-campaign-callers'
import PhoningRatioProgress from '../shared/PhoningRatioProgress'

const PhoningCampaignCallers = ({ number, firstName, lastName, count, goal }) => (
  <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
    <UICard
      rootProps={{ sx: { height: '125px' } }}
      headerProps={{ sx: { pt: '21px' } }}
      header={
        <TruncatedText variant="subtitle1" sx={{ color: 'gray900' }} title={`${firstName} ${lastName}`}>
          {number}. {firstName} {lastName}
        </TruncatedText>
      }
      contentProps={{ sx: { pt: 3 } }}
      content={goal && <PhoningRatioProgress count={count} totalCount={goal} />}
    />
  </Grid>
)

PhoningCampaignCallers.propTypes = DomainPhoningCampaignCallers.PropTypes

export default PhoningCampaignCallers
