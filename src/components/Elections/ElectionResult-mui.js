import PropTypes from 'prop-types'
import isPropValid from '@emotion/is-prop-valid'

import { ElectionResult as DomainElectionResult } from 'domain/election'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

const propsAreNotAttributes = ['colorCode', 'votesCount', 'votesCast']
const avoidPropsAsAttributes = {
  shouldForwardProp: prop => isPropValid(prop) && !propsAreNotAttributes.includes(prop),
}

const Wrapper = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(0, 4, 4),
  color: 'black',
}))
const Name = styled('div')({
  fontWeight: '600',
  fontSize: '18px',
})
const Nuance = styled('div')(({ theme }) => ({
  fontWeight: '400',
  fontSize: '16px',
  marginBottom: theme.spacing(2),
}))
const Result = styled(props => <Typography variant="body2" {...props} />)(({ theme }) => ({
  fontWeight: '400',
  marginBottom: theme.spacing(2),
}))
const ProgressWrapper = styled('div')({
  height: '8px',
  borderRadius: '12px',
  background: '#F3F4F6',
})
const ProgressBar = styled('div', avoidPropsAsAttributes)`
  height: 8px;
  borderradius: 12px;
  background: ${({ colorCode }) => colorCode};
  width: ${({ votesCount, votesCast }) => `${(votesCount / votesCast) * 100}%`};
`

const ElectionResult = ({ result, votesCast }) => {
  const { nuance, colorCode, candidateFirstname, candidateLastname, votesCount } = result

  return (
    <Wrapper>
      {(candidateFirstname || candidateLastname) && (
        <Name>
          {candidateFirstname} {candidateLastname}
        </Name>
      )}
      {nuance && <Nuance>{nuance}</Nuance>}
      <Result>
        {votesCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
        &nbsp;voix &nbsp;-&nbsp;
        <Typography variant="body2">{((votesCount / votesCast) * 100).toFixed(2)}%</Typography>
      </Result>
      <ProgressWrapper>
        <ProgressBar colorCode={colorCode} votesCount={votesCount} votesCast={votesCast} />
      </ProgressWrapper>
    </Wrapper>
  )
}

ElectionResult.propTypes = {
  result: DomainElectionResult.propTypes.isRequired,
  votesCast: PropTypes.number.isRequired,
}

export default ElectionResult
