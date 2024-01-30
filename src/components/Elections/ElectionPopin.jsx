import PropTypes from 'prop-types'
import { CardHeader as MuiCardHeader, IconButton as MuiIconButton, Typography } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { styled } from '@mui/system'

import Percentage from '~/ui/Percentage'
import Loader from '~/ui/Loader'
import { ElectionResult as DomainElectionResult } from '~/domain/election'
import ElectionResult from './ElectionResult'
import { ElectionFirstStage } from './shared/constants'

const Popin = styled('div')(
  ({ theme }) => `
  position: absolute;
  top: 8px;
  right: 8px;
  z-Index: 1;
  color: ${theme.palette.blackCorner};
  background: ${theme.palette.whiteCorner};
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 93%;
  width: 330px;
  border-radius: 8px;
`
)

const Error = styled('div')(
  ({ theme }) => `
  text-align: center;
  margin: ${theme.spacing(0, 'auto')};
  overflow: hidden;
  padding: ${theme.spacing(2)};
`
)

const CardHeader = styled(MuiCardHeader)(({ theme }) => ({
  '&.MuiCardHeader-root': {
    padding: theme.spacing(2, 2, 2, 4),
  },
}))

const Title = styled(Typography)`
  color: ${({ theme }) => theme.palette.blueCorner};
  font-size: 22px;
  font-weight: 600;
`
const IconButton = styled(MuiIconButton)(
  ({ theme }) => `
  margin-top: 0;
  padding: ${theme.spacing(1)};
  color: ${theme.palette.gray600};
`
)

const Container = styled('div')(
  ({ theme }) => `
  background-color: ${theme.palette.grayCornerBg};
  padding: ${theme.spacing(4)};
  margin-bottom: ${theme.spacing(4)};
`
)

const Kpi = styled('div')(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 400,
  '&:first-of-type': {
    marginBottom: theme.spacing(2),
  },
}))

const messages = {
  firstStage: '1er tour',
  secondStage: '2ème tour',
  registered: ' inscrits',
  participation: 'Taux de participation: ',
  whitesAndNulls: 'Blancs et nuls: ',
  noResult: 'Aucune donnée à afficher',
}

const ElectionPopin = ({ loader, zone, filterValues, participation, results, handleClose }) => {
  const { election, year, round: stage } = filterValues
  const { registered, voting, votesCast } = participation

  return (
    <Popin id="map-overlay">
      {loader && (
        <Error>
          <Loader />
        </Error>
      )}

      {!loader && (
        <>
          <CardHeader
            title={zone && <Title>{zone}</Title>}
            subheader={
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 400 }}>
                {election} {year}
                &nbsp;-&nbsp;
                {stage === ElectionFirstStage ? messages.firstStage : messages.secondStage}
              </Typography>
            }
            action={
              <IconButton onClick={handleClose} size="large">
                <CloseRoundedIcon />
              </IconButton>
            }
          />

          {Object.keys(participation).length > 0 && results.length > 0 && (
            <>
              <Container>
                <Kpi>
                  <Typography sx={{ fontWeight: 600 }}>
                    {registered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    {messages.registered}
                  </Typography>
                </Kpi>
                <Kpi>
                  {messages.participation}
                  <Typography sx={{ fontWeight: 600 }}>
                    <Percentage>{voting / registered}</Percentage>
                  </Typography>
                </Kpi>
                <Kpi>
                  {messages.whitesAndNulls}
                  <Typography sx={{ fontWeight: 600 }}>
                    <Percentage>{(voting - votesCast) / voting}</Percentage>
                  </Typography>
                </Kpi>
              </Container>
              <div>
                {results
                  .sort((a, b) => b.votesCount - a.votesCount)
                  .map((result, index) => (
                    <ElectionResult key={index} votesCast={votesCast} result={result} />
                  ))}
              </div>
            </>
          )}
          {results.length === 0 && <Container>{messages.noResult}</Container>}
        </>
      )}
    </Popin>
  )
}

ElectionPopin.propTypes = {
  loader: PropTypes.bool.isRequired,
  zone: PropTypes.string,
  filterValues: PropTypes.shape({
    election: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    round: PropTypes.string,
  }),
  electionRound: PropTypes.string,
  participation: PropTypes.shape({
    registered: PropTypes.number,
    voting: PropTypes.number,
    votesCast: PropTypes.number,
  }).isRequired,
  results: PropTypes.arrayOf(DomainElectionResult.propTypes).isRequired,
  handleClose: PropTypes.func,
}

export default ElectionPopin
