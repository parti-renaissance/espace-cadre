import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { Typography } from '@mui/material'
import { TruncatedText, VerticalContainer } from 'components/shared/styled'

const UiSubTitle = styled(Typography)`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.gray600};
`

export const Title = ({ subject, author, ...props }) => (
  <VerticalContainer {...props}>
    <TruncatedText variant="subtitle1" title={subject} sx={{ color: 'gray900' }}>
      {subject}
    </TruncatedText>
    <UiSubTitle>{author}</UiSubTitle>
  </VerticalContainer>
)

Title.propTypes = {
  subject: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
}
