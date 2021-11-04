import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(0, 4, 4),
        color: 'black',
    },
    name: {
        fontWeight: '600',
        fontSize: '18px',
    },
    nuance: {
        fontWeight: '400',
        fontSize: '16px',
        marginBottom: theme.spacing(2),
    },
    result: {
        fontSize: '14px',
        fontWeight: '400',
        marginBottom: theme.spacing(2),
    },
    resultCount: {
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
        background: ({ colorCode }) => colorCode,
        width: ({ votesCount, votesCast }) => `${(votesCount / votesCast) * 100}%`,
    },
}));

const ElectionResult = ({ nuance, colorCode, firstname, lastname, votesCount, votesCast }) => {
    const classes = useStyles({ colorCode, votesCount, votesCast });

    return (
        <div className={classes.root}>
            <div className={classes.name}>{firstname} {lastname}</div>
            <div className={classes.nuance}>{nuance}</div>
            <div className={classes.result}>
                {votesCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                &nbsp;voix
                &nbsp;-&nbsp;
                <span className={classes.resultCount}>
                  {((votesCount / votesCast) * 100).toFixed(2)}%
                </span>
            </div>
            <div className={classes.progress}>
                <div className={classes.progressBar} />
            </div>
        </div>
    );
};

ElectionResult.propTypes = {
    nuance: PropTypes.string,
    colorCode: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    votesCount: PropTypes.number,
    votesCast: PropTypes.number,
};

export default ElectionResult;
