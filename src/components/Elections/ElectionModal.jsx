import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    electionModalContent: {
        padding: '0 32px 32px',
        color: 'black',
    },
    candidatName: {
        fontWeight: '600',
        fontSize: '18px',
    },
    candidatNuance: {
        fontWeight: '400',
        fontSize: '16px',
        marginBottom: '16px',
    },
    candidatResultat: {
        fontSize: '14px',
        fontWeight: '400',
        marginBottom: '16px',
    },
    resultatSpan: {
        fontWeight: '600',
    },
    progress: {
        height: '8px',
        borderRadius: '12px',
        background: '#F3F4F6',
    },
    progressBar: {
        height: '8px',
        borderRadius: '12px',
    },
});

const ElectionModal = ({
    row: {
        nuance, nom, prenom, voix, code_couleur,
    }, exprimes,
}) => {
    const classes = useStyles();

    return (
        <div className={classes.electionModalContent}>
            <div className={classes.candidatName}>{prenom} {nom}</div>
            <div className={classes.candidatNuance}>{nuance}</div>
            <div className={classes.candidatResultat}>
                {voix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} voix - <span className={classes.resultatSpan}>{((voix / exprimes) * 100).toFixed(2)}%</span>
            </div>
            <div className={classes.progress}>
                <div
                    className={classes.progressBar}
                    style={{
                        background: `${code_couleur}`,
                        width: `${(voix / exprimes) * 100}%`,
                    }}
                />
            </div>
        </div>
    );
};

export default ElectionModal;

ElectionModal.propTypes = {
    row: PropTypes.objectOf(Object).isRequired,
    exprimes: PropTypes.number.isRequired,
};
