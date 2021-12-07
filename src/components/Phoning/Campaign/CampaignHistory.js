import PropTypes from 'prop-types'
import { Button as MuiButton, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

import { chipColorsByStatus, chipLabelByStatus, translatedGender } from './shared/constants'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import UICard from '../Card'
import Chip from '../Chip'

const HeaderWrapper = styled('div')({
  '& .MuiCardHeader-content': {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
})
const TruncatedText = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const ChipLabel = styled(Typography)`
  font-size: 10px;
  font-weight: 500;
  line-height: 15px;
  border-radius: 19px;
`
const Author = styled(TruncatedText)`
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
`
const UpdateTime = styled(Typography)`
  font-size: 10px;
  font-weight: 400;
  line-height: 18px;
`
const Button = styled(
  MuiButton,
  shouldForwardProps
)(({ theme }) => ({
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

const PhoningCampaignHistory = ({ status, adherent, caller, updateTime, handleClick }) => {
  const chipLabel = chipLabelByStatus[status]
  const chipColors = chipColorsByStatus[status] || {}
  const genre = translatedGender[adherent.gender]
  return (
    <Grid item lg={3} xl={3} sx={{ flexGrow: 1 }}>
      <UICard
        rootProps={{ sx: { borderRadius: '8px' } }}
        headerTitle={
          <TruncatedText variant="subtitle1">
            {adherent.firstName} {adherent.lastName}
          </TruncatedText>
        }
        headerSubtitle={
          <Typography variant="subtitle2" sx={{ color: 'gray600' }}>
            {genre}&#44;&nbsp;{adherent.age}&nbsp;{messages.years}
          </Typography>
        }
        headerProps={{ component: HeaderWrapper, sx: { pb: 1 } }}
        content={
          <>
            <Chip label={<ChipLabel>{chipLabel}</ChipLabel>} {...chipColors} />
            <Grid container direction="column" sx={{ pt: 2 }}>
              <Author sx={{ pb: 0.5 }}>
                {caller.firstName} {caller.lastName}
              </Author>
              <UpdateTime>{updateTime}</UpdateTime>
            </Grid>
          </>
        }
        actions={<Button onClick={handleClick}>{messages.see}</Button>}
        actionsProps={{ sx: { p: 2 } }}
      />
    </Grid>
  )
}

PhoningCampaignHistory.propTypes = {
  status: PropTypes.string.isRequired,
  adherent: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
  }).isRequired,
  caller: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  updateTime: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default PhoningCampaignHistory
