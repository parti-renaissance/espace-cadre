import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import { TruncatedText, VerticalContainer } from 'components/shared/styled'

export const Title = ({ subject, author, lines, ...props }) => (
  <VerticalContainer {...props}>
    <TruncatedText variant="subtitle1" title={subject} sx={{ color: 'gray900' }} lines={lines}>
      {subject}
    </TruncatedText>
    <Typography variant="subtitle2" sx={{ color: 'gray600', pt: 1 }}>
      {author}
    </Typography>
  </VerticalContainer>
)

Title.propTypes = {
  subject: PropTypes.string.isRequired,
  lines: PropTypes.number,
  author: PropTypes.string.isRequired,
}
