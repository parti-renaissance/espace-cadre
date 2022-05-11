import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import CircleRoundedIcon from '@mui/icons-material/CircleRounded'

const LegendItem = ({ title, main1, main2, bold1, bold2, subtitle, color }) => (
  <Grid item display="flex" flexDirection="column" sx={{ mb: 2, mt: 2 }}>
    <Grid item display="flex" alignItems="center">
      <Typography variant="subtitle1">{title}</Typography>&nbsp;
      <CircleRoundedIcon sx={{ color }} />
    </Grid>
    <Typography>
      {main1}
      <Typography sx={{ fontWeight: 600 }}>{bold1}</Typography>
      {main2}
      <Typography sx={{ fontWeight: 600 }}>{bold2}</Typography>
    </Typography>
    <Typography sx={{ fontStyle: 'italic' }}>{subtitle}</Typography>
  </Grid>
)

LegendItem.propTypes = {
  title: PropTypes.string.isRequired,
  main1: PropTypes.string.isRequired,
  main2: PropTypes.string.isRequired,
  bold1: PropTypes.string.isRequired,
  bold2: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
}

export default LegendItem
