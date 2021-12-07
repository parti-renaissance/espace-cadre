import PropTypes from 'prop-types'
import { Button as MuiButton, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

import { chipColorsByStatus, chipLabelByStatus, defaultChipColor, translatedGender } from './shared/constants'
import { TruncatedText } from './shared/components'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import UICard from 'ui/Card/Card'
import UIChip from 'ui/Card/Chip/Chip'

const HeaderWrapper = styled('div')({
  '& .MuiCardHeader-content': {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
})
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
  const chipColors = chipColorsByStatus?.[status] || defaultChipColor
  const gender = translatedGender[adherent.gender]
  return (
    <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
      <UICard
        rootProps={{ sx: { borderRadius: '8px' } }}
        headerTitle={
          <TruncatedText variant="subtitle1" title={`${adherent.firstName} ${adherent.lastName}`}>
            {adherent.firstName} {adherent.lastName}
          </TruncatedText>
        }
        headerSubtitle={
          <Typography variant="subtitle2" sx={{ color: 'gray600' }}>
            {gender && `${gender}, `}
            {adherent.age && `${adherent.age} ${messages.years}`}
          </Typography>
        }
        headerProps={{ component: HeaderWrapper, sx: { pb: 1 } }}
        content={
          <>
            <UIChip label={<ChipLabel>{chipLabel}</ChipLabel>} {...chipColors} />
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
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    gender: PropTypes.string,
    age: PropTypes.number,
  }).isRequired,
  caller: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  updateTime: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default PhoningCampaignHistory
