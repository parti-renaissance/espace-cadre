import PropTypes from 'prop-types'
import { v1 as uuid } from 'uuid'
import { Grid, Typography } from '@mui/material'

import UICard from '../Card'
import PhoningRatioProgress from '../shared/PhoningRatioProgress'

const PhoningCampaignCallers = ({ number, firstName, lastName, count, goal }) => (
  <Grid item key={uuid()} lg={3} xl={3} sx={{ flexGrow: 1 }}>
    <UICard
      headerTitle={
        <Typography variant="subtitle1" sx={{ color: 'gray900' }}>
          {number}. {firstName} {lastName}
        </Typography>
      }
      content={goal && <PhoningRatioProgress count={count} totalCount={goal} />}
      contentProps={{ sx: { '&:last-child': { pb: 2 } } }}
    />
  </Grid>
)

PhoningCampaignCallers.propTypes = {
  number: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
}

export default PhoningCampaignCallers
