import { Grid } from '@mui/material'

import UICard from 'ui/Card/Card'
import { CardRootWrapper, CardContentWrapper, TruncatedText } from './shared/components'
import DomainPhoningCampaignCallers from 'domain/phoning-campaign-callers'
import PhoningRatioProgress from '../shared/PhoningRatioProgress'

const PhoningCampaignCallers = ({ number, firstName, lastName, count, goal }) => (
  <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
    <UICard
      rootProps={{
        component: props => (
          <CardRootWrapper direction="column" alignItems="flex-start" justifyContent="center" {...props} />
        ),
      }}
      headerProps={{ sx: { pt: 0, pb: 3, px: 2, '& .MuiCardHeader-content': { overflow: 'hidden' } } }}
      contentProps={{ component: CardContentWrapper }}
      headerTitle={
        <TruncatedText variant="subtitle1" sx={{ color: 'gray900' }} title={`${firstName} ${lastName}`}>
          {number}. {firstName} {lastName}
        </TruncatedText>
      }
      content={goal && <PhoningRatioProgress count={count} totalCount={goal} />}
    />
  </Grid>
)

PhoningCampaignCallers.propTypes = DomainPhoningCampaignCallers.PropTypes

export default PhoningCampaignCallers
