import PropTypes from 'prop-types';
import { CardHeader, IconButton, makeStyles, Typography } from '@material-ui/core';

import ConvertToPercent from 'components/HelperComponents/ConvertToPercent';
import Loader from 'components/HelperComponents/Loader';
import ElectionResult from './ElectionResult';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { ElectionFirstStage } from './shared/constants';

const useStyles = makeStyles((theme) => ({
  title: {
      display: 'flex',
      marginBottom: theme.spacing(1),
      fontWeight: 400,
  },
  icon: {
      marginTop: 0,
      padding: theme.spacing(1),
      color: theme.palette.gray600,
  },
}));

const messages = {
  firstStage: '1er tour',
  secondStage: '2ème tour',
};

const ElectionPopin = ({ error, zone, filterValues, participation = {}, results, handleClose }) => {
  const classes = useStyles();
  const { election, year, round: stage } = filterValues;
  const { registered, voting, votesCast } = participation;

  return (
    <div id="map-overlay">{/* TODO: extract #map-overlay from .scss to JSS */}
      {error && <div className="modal-error text-center">
        <Loader />
      </div>}

      {!error && <>
        {zone && <div className="elections-area">{zone}</div>}

        <CardHeader
          title={<Typography variant="body2" className={classes.title}>
            {election} {year}
            &nbsp;-&nbsp;
            {stage === ElectionFirstStage ? messages.firstStage : messages.secondStage}
          </Typography>}
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
                  &nbsp;registered
                  </span>
              </div>
              <div className="flash-div">
                Taux de participation:
                &nbsp;
                <span className="flash-span">
                  <ConvertToPercent valueToConvert={voting / registered} />
                </span>
              </div>
              <div className="flash-div">
                Blancs et nuls:&nbsp;
                <span className="flash-span">
                  {(((voting - votesCast) / voting) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
            <div>
              {results.sort((a, b) => b.votesCount - a.votesCount).map((result, index) => (
                <ElectionResult key={index} votesCast={votesCast} result={result} />
              ))}
            </div>
          </>
        )}
        {Object.keys(participation).length === 0 && results.length === 0 && (
          <div className="flash-info">
            <div className="modal-error">Aucune donnée à afficher</div>
          </div>
        )}
      </>}
    </div>
  );
};

ElectionPopin.propTypes = {
  error: PropTypes.bool.isRequired,
  zone: PropTypes.string,
  filterValues: PropTypes.shape({
    election: PropTypes.string,
    year: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    round: PropTypes.string,
  }),
  electionRound: PropTypes.string,
  participation: PropTypes.shape({
    registered: PropTypes.number,
    voting: PropTypes.number,
    votesCast: PropTypes.number,
  }).isRequired,
  results: PropTypes.array.isRequired,
  handleClose: PropTypes.func,
};

export default ElectionPopin;
