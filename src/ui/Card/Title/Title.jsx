import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import Person from '@mui/icons-material/Person'
import AccessTime from '@mui/icons-material/AccessTime'

import { TruncatedText, VerticalContainer, HorizontalContainer } from '~/components/shared/styled'
import { formatDate } from '~/shared/helpers'

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
    {dateTime && (
      <HorizontalContainer>
        <AccessTime sx={{ mr: 0.5, color: 'gray600', fontSize: '12px' }} />
        <Typography variant="subtitle2" sx={{ color: 'gray600' }}>
          Le {formatDate(dateTime, 'dd/MM/yyyy')} à {formatDate(dateTime, 'HH:mm')}
        </Typography>
      </HorizontalContainer>
    )}
  </VerticalContainer>
)

Title.propTypes = {
  subject: PropTypes.string.isRequired,
  lines: PropTypes.number,
  author: PropTypes.string.isRequired,
  dateTime: PropTypes.object,
}
