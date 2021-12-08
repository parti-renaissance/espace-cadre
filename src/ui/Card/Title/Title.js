import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { Typography } from '@mui/material'

const VerticalContainer = styled('div')`
  display: flex;
  flex-direction: column;
`

const UiTitle = styled(Typography)(
  ({ theme }) => `
  color: ${theme.palette.gray900};
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`
)
const UiSubTitle = styled(Typography)`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.gray600};
`

export const Title = ({ subject, author }) => (
  <VerticalContainer>
    <UiTitle component="div">{subject}</UiTitle>
    <UiSubTitle>{author}</UiSubTitle>
  </VerticalContainer>
)

Title.propTypes = {
  subject: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
}
