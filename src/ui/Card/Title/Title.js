import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import { Person, AccessTime } from '@mui/icons-material'
import { format } from 'date-fns'

import { TruncatedText, VerticalContainer, HorizontalContainer } from 'components/shared/styled'

export const Title = ({ subject, author, dateTime, lines = 1, ...props }) => (
  <VerticalContainer {...props}>
    <TruncatedText variant="subtitle1" sx={{ color: 'gray900', height: '45px', mb: 0.5 }} lines={lines} title={subject}>
      {subject}
    </TruncatedText>
    <HorizontalContainer>
      <Person sx={{ mr: 0.5, color: 'gray600', fontSize: '12px' }} />
      <Typography variant="subtitle2" sx={{ color: 'gray600' }}>
        {author}
      </Typography>
    </HorizontalContainer>
    <HorizontalContainer>
      <AccessTime sx={{ mr: 0.5, color: 'gray600', fontSize: '12px' }} />
      <Typography variant="subtitle2" sx={{ color: 'gray600' }}>
        {`Le ${format(dateTime || '', 'dd/MM/yyyy')} à ${format(dateTime || '', 'HH:mm')}`}
      </Typography>
    </HorizontalContainer>
  </VerticalContainer>
)

Title.propTypes = {
  subject: PropTypes.string.isRequired,
  lines: PropTypes.number,
  author: PropTypes.string.isRequired,
  dateTime: PropTypes.object,
}
