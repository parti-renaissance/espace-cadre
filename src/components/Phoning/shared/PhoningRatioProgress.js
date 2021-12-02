import PropTypes from 'prop-types'
import { Grid, LinearProgress, Typography } from '@mui/material'
import { styled } from '@mui/system'

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: '8px',
  borderRadius: '6px',
  background: theme.palette.phoning.background.progressBar.empty,
  '& .MuiLinearProgress-bar1Determinate': {
    background: theme.palette.phoning.background.progressBar.filled,
  },
}))

const Current = styled(Typography)(
  ({ theme }) => `
  color: ${theme.palette.phoning.background.ratio.current};
  font-size: 28px;
  font-weight: 600;
  line-height: 28px;
`
)
const Max = styled(Typography)(
  ({ theme }) => `
  padding-left: ${theme.spacing(0.3)};
  color: ${theme.palette.phoning.background.ratio.max};
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`
)

const messages = {
  separator: '/',
}

const PhoningRatioProgress = ({ count, totalCount }) => (
  <>
    <Grid container alignItems="flex-end">
      <Current>{count}</Current>
      <Max>
        {messages.separator}
        {totalCount}
      </Max>
    </Grid>
    <ProgressBar variant="determinate" value={Math.round((count / totalCount) * 100)} sx={{ mt: 0.5 }} />
  </>
)

PhoningRatioProgress.propTypes = {
  count: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
}

export default PhoningRatioProgress
