import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { Typography, Box } from '@mui/material'

import { ElectionResult as DomainElectionResult } from '~/domain/election'
import { shouldForwardProps } from '~/components/shared/shouldForwardProps'

const Container = styled('div')(
  ({ theme }) => `
  padding: ${theme.spacing(0, 4, 4)};
  color: ${theme.palette.blackCorner};
`
)

const Nuance = styled(props => <Typography component="div" {...props} />)`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Progress = styled('div')`
  height: 8px;
  border-radius: 12px;
  background: ${({ theme }) => theme.palette.gray100};
`
const ProgressBar = styled(
  'div',
  shouldForwardProps
)(
  ({ colorCode, votesCount, votesCast }) => `
  height: 8px;
  border-radius: 12px;
  background: ${colorCode};
  width: ${(votesCount / votesCast) * 100}%;
`
)

const messages = {
  voices: 'voix',
}

const ElectionResult = ({ result, votesCast }) => {
  const { nuance, colorCode, candidateFirstname, candidateLastname, votesCount } = result

  return (
    <Container>
      {(candidateFirstname || candidateLastname) && (
        <Typography sx={{ fontWeight: '600', fontSize: '18px' }}>
          {candidateFirstname} {candidateLastname}
        </Typography>
      )}
      {nuance && <Nuance>{nuance}</Nuance>}
      <Box component="div" sx={{ mb: 2 }}>
        <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>
          {votesCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          &nbsp;{messages.voices} &nbsp;-&nbsp;
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
          {((votesCount / votesCast) * 100).toFixed(2)}%
        </Typography>
      </Box>
      <Progress>
        <ProgressBar votesCast={votesCast} votesCount={votesCount} colorCode={colorCode} />
      </Progress>
    </Container>
  )
}

ElectionResult.propTypes = {
  result: DomainElectionResult.propTypes.isRequired,
  votesCast: PropTypes.number.isRequired,
}

export default ElectionResult
