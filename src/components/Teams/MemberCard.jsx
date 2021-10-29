import {
    Grid, Card, makeStyles, createStyles,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import PropTypes from 'prop-types';
import { TeamMember } from '../../domain/team';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        padding: theme.spacing(2),
        borderRadius: '8.35px',
        boxShadow: 'none',
    },
    name: {
        fontSize: '16px',
        fontWeight: '600',
        color: theme.palette.gray900,
    },
    info: {
        fontSize: '12px',
        fontWeight: '400',
        color: theme.palette.gray600,
    },
    icon: {
        cursor: 'pointer',
    },
}));

const MemberCard = ({ member, handleDelete }) => {
    const {
        id, firstname, lastname, postalCode, registeredAt,
    } = member;
    const classes = useStyles();

    return (
        <Grid item key={id} xs={12} sm={6} md={3}>
            <Card className={classes.root}>
                <Grid container justifyContent="space-between">
                    <Grid item className={classes.name}>
                        {firstname} {lastname}
                    </Grid>
                    <Grid item>
                        <ClearIcon onClick={handleDelete} className={classes.icon} />
                    </Grid>
                </Grid>
                <Grid container className={classes.info}>
                    <Grid item xs={12}>
                        {postalCode}, adhérent(e) depuis le {new Date(registeredAt).toLocaleDateString()}
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    );
};

export default MemberCard;

MemberCard.defaultProps = {
    handleDelete: () => {},
};

MemberCard.propTypes = {
    member: TeamMember.propTypes.isRequired,
    handleDelete: PropTypes.func,
};
