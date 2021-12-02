import PropTypes from 'prop-types'
import { v1 as uuid } from 'uuid'
import { Grid, Typography } from '@mui/material'

import UICard from '../Card'
import PhoningRatioProgress from '../shared/PhoningRatioProgress'

const PhoningCampaignCalling = ({ calling = [] }) => (
  <Grid container spacing={2}>
    {calling.map(({ firstName, lastName, count, totalCount }, index) => (
      <Grid item key={uuid()} lg={3} xl={3} sx={{ flexGrow: 1 }}>
        <UICard
          headerTitle={
            <Typography variant="subtitle1" sx={{ color: 'gray900' }}>
              {index + 1}. {firstName} {lastName}
            </Typography>
          }
          content={<PhoningRatioProgress count={count} totalCount={totalCount} />}
          contentProps={{ sx: { '&:last-child': { pb: 2 } } }}
        />
      </Grid>
    ))}
  </Grid>
)

PhoningCampaignCalling.propTypes = {
  calling: PropTypes.array.isRequired,
}

export default PhoningCampaignCalling
