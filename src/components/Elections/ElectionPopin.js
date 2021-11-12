import PropTypes from 'prop-types'
import { CardHeader, IconButton, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import Percentage from 'ui/Percentage'
import Loader from 'ui/Loader'
import { ElectionResult as DomainElectionResult } from 'domain/election'
import ElectionResult from './ElectionResult'
import { ElectionFirstStage } from './shared/constants'

const useStyles = makeStyles(theme => ({
  mapOverlay: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    zIndex: 1,
    fontFamily: 'Poppins, sans-serif',
    color: theme.palette.blackCorner,
    background: theme.palette.whiteCorner,
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: '93%',
    width: '330px',
    borderRadius: '8.35px',
  },
  MUICardRoot: {
    padding: theme.spacing(2, 2, 2, 4),
  },
  title: {
    color: theme.palette.blueCorner,
    fontSize: '22px',
    fontWeight: 600,
  },
  subTitle: {
    marginBottom: theme.spacing(1),
    fontWeight: 400,
  },
  icon: {
    marginTop: 0,
    padding: theme.spacing(1),
    color: theme.palette.gray600,
  },
  flashInfo: {
    backgroundColor: theme.palette.grayCornerBg,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  flashDiv: {
    fontSize: '16px',
    fontWeight: 400,
    '&:first-child': {
      marginBottom: theme.spacing(2),
    },
  },
  flashSpan: {
    fontWeight: 600,
  },
  error: {
    fontSize: '16px',
    fontWeight: 400,
    textAlign: 'center',
    margin: theme.spacing(0, 'auto'),
    overflow: 'hidden',
    padding: '16px',
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
  const classes = useStyles()
  const { election, year, round: stage } = filterValues
  const { registered, voting, votesCast } = participation

  return (
    <div id="map-overlay" className={classes.mapOverlay}>
      {loader && (
        <div className={`text-center ${classes.error}`}>
          <Loader />
        </div>
      )}

      {!loader && (
        <>
          <CardHeader
            classes={{ root: classes.MUICardRoot }}
            title={zone && <span className={classes.title}>{zone}</span>}
            subheader={
              <Typography variant="body2" className={classes.subTitle}>
                {election} {year}
                &nbsp;-&nbsp;
                {stage === ElectionFirstStage ? messages.firstStage : messages.secondStage}
              </Typography>
            }
            action={
              <IconButton className={classes.icon} onClick={handleClose}>
                <CloseRoundedIcon />
              </IconButton>
            }
          />

          {Object.keys(participation).length > 0 && results.length > 0 && (
            <>
              <div className={classes.flashInfo}>
                <div className={classes.flashDiv}>
                  <span className={classes.flashSpan}>
                    {registered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    {messages.registered}
                  </span>
                </div>
                <div className={classes.flashDiv}>
                  {messages.participation}
                  <span className={classes.flashSpan}>
                    <Percentage>{voting / registered}</Percentage>
                  </span>
                </div>
                <div className={classes.flashDiv}>
                  {messages.whitesAndNulls}
                  <span className={classes.flashSpan}>
                    <Percentage>{(voting - votesCast) / voting}</Percentage>
                  </span>
                </div>
              </div>
              <div>
                {results
                  .sort((a, b) => b.votesCount - a.votesCount)
                  .map((result, index) => (
                    <ElectionResult key={index} votesCast={votesCast} result={result} />
                  ))}
              </div>
            </>
          )}
          {results.length === 0 && (
            <div className="flash-info">
              <div className="modal-error">{messages.noResult}</div>
            </div>
          )}
        </>
      )}
    </div>
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
