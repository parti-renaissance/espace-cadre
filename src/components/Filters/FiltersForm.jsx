import { useState } from 'react'
import { Box, Button, createStyles, Grid, makeStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import Factory from './FiltersFactory/Factory'

const useStyles = makeStyles(theme =>
  createStyles({
    boxContainer: {
      marginTop: theme.spacing(2),
    },
    filtersContainer: {
      marginBottom: theme.spacing(1.5),
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
  })
)

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

  return (
    <Box className={classes.boxContainer}>
      <form
        onSubmit={event => {
          event.preventDefault()
          onSubmit(localValues)
        }}
      >
        <Grid container spacing={2} className={classes.filtersContainer}>
          {filterElements}
        </Grid>
        <Grid container className={classes.buttonContainer}>
          <Button type="submit" className={classes.buttonFilter}>
            Filtrer
          </Button>
          <Button
            className={classes.resetButtonFilters}
            onClick={() => {
              setLocalValues(values)
              onReset()
            }}
          >
            Réinitialiser
          </Button>
        </Grid>
      </form>
    </Box>
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
