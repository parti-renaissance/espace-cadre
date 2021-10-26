import { isValidElement } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { ListItem, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(4),
    color: theme.palette.blueCorner,
    '&:hover, &:visited': {
      color: theme.palette.grayCorner3,
    },
  },
  item: {
    fontWeight: 600,
    fontSize: '14px',
    padding: '13px 0 11px',
    marginBottom: '16px',
  },
  label: {
    paddingLeft: theme.spacing(2),
  },
  active: {
    color: theme.palette.blueCorner,
    '&:hover, &:visited': {
      color: theme.palette.blueCorner,
    },
  },
}));

const UINavItem = ({
  path,
  label,
  icon = null,
  linkClasses = null,
}) => {
  const classes = useStyles();
  const IconComponent = icon;

  const item = (
    <ListItem className={classes.item} disableGutters>
      {isValidElement(<IconComponent />) && <IconComponent />}
      <span className={classes.label}>{label}</span>
    </ListItem>
  );

  return (
    <>
      {!path && item}
      {path && <NavLink
        className={`${classes.link} ${linkClasses}`}
        activeClassName={classes.active}
        isActive={(match) => !!match}
        to={path}
        exact
      >
        {item}
      </NavLink>}
    </>
  );
};

UINavItem.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.object,
  linkClasses: PropTypes.string,
};

export default UINavItem;
