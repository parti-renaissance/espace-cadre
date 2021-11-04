import PropTypes from 'prop-types';
import { Icon, makeStyles } from '@material-ui/core';

import ConvertToPercent from '../HelperComponents/ConvertToPercent';
import Loader from '../HelperComponents/Loader';
import ElectionResult from './ElectionResult';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

const ElectionRoundFirst = '1';
const ElectionRoundSecond = '2';
const ElectionRoundLabels = {
  [ElectionRoundFirst]: '1er tour',
  [ElectionRoundSecond]: '2e tour',
};

const useStyles = makeStyles((theme) => ({
    icon: {
        fontSize: '14px',
        paddingRight: theme.spacing(2),
    },
}));

const ElectionModal = ({ error, zone, filterValues, participations, results }) => {
  const classes = useStyles();
  const { election, year, round } = filterValues;
  const [participation = {}] = participations;
  const { inscrits: registered, votants: voting, exprimes: votesCast } = participation;

  return (
    <div id="map-overlay">
      {error && <div className="modal-error text-center">
        <Loader />
      </div>}

      {!error && 
      <>
        {zone && <div className="elections-area">{zone}</div>}

        <div className="election-name">
          {election} {year}-
          {round === ElectionRoundFirst ? 
            ElectionRoundLabels[ElectionRoundFirst] : ElectionRoundLabels[ElectionRoundSecond]
          }
        </div>

        <Icon component={CloseRoundedIcon} className={classes.icon} />

        {participations.length > 0 && results.length > 0 && (
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
                <ElectionResult key={index} votesCast={votesCast} {...result} />
              ))}
            </div>
          </>
        )}
        {participations.length === 0 && results.length === 0 && (
          <div className="flash-info">
            <div className="modal-error">Aucune donnée à afficher</div>
          </div>
        )}
      </>}
    </div>
  );
};

ElectionModal.propTypes = {
  error: PropTypes.bool.isRequired,
  zone: PropTypes.string,
  filterValues: PropTypes.shape({
    election: PropTypes.string,
    year: PropTypes.number,
    round: PropTypes.string,
  }),
  electionRound: PropTypes.string,
  participations: PropTypes.array.isRequired,
  results: PropTypes.array.isRequired,
};

export default ElectionModal;
