import { useState } from 'react'
import { Button, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import Factory from './FiltersFactory/Factory'

const useStyles = makeStyles(theme => ({
  filtersContainer: {
    marginBottom: theme.spacing(1.25),
  },
  buttonContainer: {
    marginBottom: theme.spacing(2),
  },
  buttonFilter: {
    color: theme.palette.whiteCorner,
    background: `${theme.palette.gray700}`,
    marginRight: theme.spacing(2),
    borderRadius: '8.35px',
    '&:hover': {
      background: theme.palette.gray600,
    },
  },
  resetButtonFilters: {
    color: theme.palette.gray700,
    border: `1px solid ${theme.palette.gray300}`,
    borderRadius: '8.35px',
    '&:hover': {
      background: theme.palette.gray200,
    },
  },
}))

const messages = {
  filter: 'Filtrer',
  reset: 'Réinitialiser',
}

const FiltersForm = ({ filters, onSubmit, onReset, values }) => {
  const [localValues, setLocalValues] = useState(values)
  const factory = new Factory()
  const classes = useStyles()

  const filterElements = filters.map(filter => {
    const filterElement = factory.create(filter.type || 'text', {
      filter,
      value: localValues[filter.code] || '',
      defaultValue: values[filter.code] || null,
      onChange: value => {
        setLocalValues(prevState => {
          const { [filter.code]: oldValue, ...newState } = prevState
          if (value === null || value === undefined) {
            return newState
          }
          return { ...newState, [filter.code]: value }
        })
      },
    })

    return (
      <Grid key={filter.code} item xs={12} sm={6} lg={4}>
        {filterElement}
      </Grid>
    )
  })

  if (!filterElements.length) {
    return null
  }

  const handleClick = () => {
    setLocalValues(values)
    onReset()
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(localValues)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} className={classes.filtersContainer}>
        {filterElements}
      </Grid>
      <Grid container className={classes.buttonContainer}>
        <Button type="submit" className={classes.buttonFilter}>
          {messages.filter}
        </Button>
        <Button className={classes.resetButtonFilters} onClick={handleClick}>
          {messages.reset}
        </Button>
      </Grid>
    </form>
  )
}
FiltersForm.defaultProps = {
  onReset: () => {},
}

FiltersForm.propTypes = {
  filters: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  defaultValues: PropTypes.object,
  onReset: PropTypes.func,
}

export default FiltersForm
