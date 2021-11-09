import { TextField } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(theme => ({
  filterBasicStyle: {
    background: theme.palette.whiteCorner,
    borderRadius: '8.35px',
    width: '100%',

    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
}))

class TextFactory {
  getType() {
    return 'text'
  }

  create({ filter, onChange, value }) {
    const classes = useStyles()

    return (
      <TextField
        variant="outlined"
        size="small"
        label={filter.label}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={classes.filterBasicStyle}
        classes={{ root: classes.root }}
      />
    )
  }
}

export default TextFactory
