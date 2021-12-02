import PropTypes from 'prop-types'
import { v1 as uuid } from 'uuid'
import { Button as MuiButton, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

import UICard from '../Card'
import PhoningCampaignCallsContent from './CampaignCallsContent'

const Button = styled(MuiButton)(({ theme }) => ({
  minWidth: 0,
  padding: theme.spacing(0.5, 1.25),
  fontSize: '13px',
  fontWeight: '500',
  lineHeight: '22px',
  letterSpacing: '0.46px',
  color: theme.palette.indigo700,
  '&:hover': {
    background: theme.palette.phoning.background.hover,
  },
}))

const messages = {
  years: 'ans',
  see: 'voir',
}

const PhoningCampaignCalls = ({ calls = [] }) => (
  <Grid container spacing={2}>
    {calls.map(({ firstName, lastName, genre, age, status, author, updateTime }) => (
      <Grid item key={uuid()} lg={3} xl={3} sx={{ flexGrow: 1 }}>
        <UICard
          rootProps={{ sx: { borderRadius: '8px' } }}
          headerTitle={
            <Typography component="div" variant="subtitle1" sx={{ color: 'gray900' }}>
              {firstName} {lastName}
            </Typography>
          }
          headerSubtitle={
            <Typography variant="subtitle2" sx={{ color: 'gray600' }}>
              {genre}&#44;&nbsp;{age}&nbsp;{messages.years}
            </Typography>
          }
          headerProps={{ sx: { pb: 1 } }}
          content={<PhoningCampaignCallsContent status={status} author={author} updateTime={updateTime} />}
          actions={<Button>{messages.see}</Button>}
          actionsProps={{ sx: { p: 2 } }}
        />
      </Grid>
    ))}
  </Grid>
)

PhoningCampaignCalls.propTypes = {
  calls: PropTypes.array.isRequired,
}

export default PhoningCampaignCalls
