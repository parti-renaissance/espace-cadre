import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Button, Icon, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(4),
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.spacing(1),
    color: theme.palette.gray600,
    '&:hover, &:visited': {
      color: ({ color }) => theme.palette[color] || 'initial',
      background: ({ bgColor }) => bgColor || 'transparent',
    },
    fontWeight: 600,
    fontSize: '14px',
    marginBottom: '16px',
    textTransform: 'none',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    paddingLeft: theme.spacing(2),
  },
  active: {
    color: theme.palette.gray600,
  },
}));

const UINavItem = ({
  path,
  label,
  icon = null,
  color = null,
  bgColor = null,
}) => {
  const classes = useStyles({ color, bgColor });

  return (
    <NavLink
      className={classes.link}
      activeClassName={classes.active}
      isActive={(match) => !!match}
      to={path}
      exact
    >
      <Button className={classes.root} color="inherit">
        <Icon component={icon} fontSize="small" />
          <span className={classes.label}>{label}</span>
      </Button>
    </NavLink>
  );
};

UINavItem.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  color: PropTypes.string,
  bgColor: PropTypes.string,
};

export default UINavItem;
