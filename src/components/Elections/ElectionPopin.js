import PropTypes from 'prop-types'
import { CardHeader, IconButton, makeStyles, Typography } from '@material-ui/core'

import Percentage from 'ui/Percentage'
import Loader from 'ui/Loader'
import ElectionResult from './ElectionResult'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import { ElectionFirstStage } from './shared/constants'

const useStyles = makeStyles(theme => ({
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
    <div id="map-overlay">
      {/* TODO: extract #map-overlay from .scss to JSS */}
      {loader && (
        <div className="modal-error text-center">
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
              <div className="flash-info">
                <div className="flash-div">
                  <span className="flash-span">
                    {registered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    {messages.registered}
                  </span>
                </div>
                <div className="flash-div">
                  {messages.participation}
                  <span className="flash-span">
                    <Percentage>{voting / registered}</Percentage>
                  </span>
                </div>
                <div className="flash-div">
                  {messages.whitesAndNulls}
                  <span className="flash-span">
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
  results: PropTypes.arrayOf(ElectionResult.propTypes).isRequired,
  handleClose: PropTypes.func,
}

export default ElectionPopin
