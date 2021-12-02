import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/system'

import { chipColorsByStatus } from './shared/constants'
import Chip from '../Chip'

const ChipLabel = styled(Typography)`
  font-size: 10px;
  font-weight: 500;
  line-height: 15px;
  border-radius: 19px;
`
const Author = styled(props => <Typography component="div" {...props} />)`
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
`
const UpdateTime = styled(props => <Typography component="div" {...props} />)`
  font-size: 10px;
  font-weight: 400;
  line-height: 18px;
`

const PhoningCampaignCallsContent = ({ status, author, updateTime }) => {
  const chipColors = chipColorsByStatus[status?.toLowerCase()] || {}
  return (
    <>
      <Chip label={<ChipLabel>{status}</ChipLabel>} {...chipColors} />
      <Box sx={{ pt: 2 }}>
        <Author sx={{ pb: 0.5 }}>{author}</Author>
        <UpdateTime>{updateTime}</UpdateTime>
      </Box>
    </>
  )
}

PhoningCampaignCallsContent.propTypes = {
  status: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  updateTime: PropTypes.string.isRequired,
}

export default PhoningCampaignCallsContent
