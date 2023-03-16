import { Grid, Tab as MuiTab, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'

export const Tab = styled(MuiTab)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.colors.gray[600],
  '&.Mui-selected': {
    color: theme.palette.colors.blue[500],
  },
}))

export const TabLabel = styled(Typography)`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`

export const LineContent = ({ label, value }) => (
  <Grid
    container
    spacing={3}
    sx={{ py: 2, px: 3, borderBottom: '1px solid', borderBottomColor: theme => theme.palette.colors.gray[200] }}
  >
    <Grid item xs={12} md={4}>
      <Typography sx={{ fontSize: '14px', fontWeight: '500', color: theme => theme.palette.colors.gray[500] }}>
        {label}
      </Typography>
    </Grid>
    <Grid item xs={12} md={8}>
      {value instanceof String ? (
        <Typography sx={{ fontSize: '14px', color: theme => theme.palette.colors.gray[900] }}>{value}</Typography>
      ) : (
        value
      )}
    </Grid>
  </Grid>
)

LineContent.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}
