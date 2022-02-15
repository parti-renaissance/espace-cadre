import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import { TruncatedText, VerticalContainer } from 'components/shared/styled'

export const Title = ({ subject, author, lines = 1, ...props }) => (
  <VerticalContainer {...props}>
    <TruncatedText variant="subtitle1" sx={{ color: 'gray900', height: '45px' }} lines={lines} title={subject}>
      {subject}
    </TruncatedText>
    <Typography variant="subtitle2" sx={{ color: 'gray600', pt: 0.5 }}>
      {author}
    </Typography>
  </VerticalContainer>
)

Title.propTypes = {
  subject: PropTypes.string.isRequired,
  lines: PropTypes.number,
  author: PropTypes.string.isRequired,
}
