import { useState } from 'react'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import Factory from './FiltersFactory/Factory'

const messages = {
  filter: 'Filtrer',
  reset: 'Réinitialiser',
}

const FiltersForm = ({ filters, onSubmit, onReset, values, onValuesChange }) => {
  const [localValues, setLocalValues] = useState(values)
  const factory = new Factory()

  const filterGroups = filters.map((group, index) => {
    const filterElements = group.filters.map(filter => {
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
            onValuesChange && onValuesChange({ ...newState, [filter.code]: value })
            return { ...newState, [filter.code]: value }
          })
        },
      })

      return (
        <Grid item key={filter.code} xs={12} sm={6}>
          {filterElement}
        </Grid>
      )
    })

    return (
      <Stack spacing={3} key={`form-group-${index}`} sx={{ p: 2, pt: 0, width: '100%' }}>
        <Typography component="p" variant="subtitle2" sx={{}}>
          {group.label}
        </Typography>
        <Box>
          <Grid container spacing={4}>
            {filterElements}
          </Grid>
        </Box>
      </Stack>
    )
  })

  if (!filterGroups.length) {
    return null
  }

  const handleClick = () => {
    setLocalValues(values)
    onValuesChange && onValuesChange(values)
    onReset()
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(localValues)
  }

  return (
    <form onSubmit={handleSubmit} data-cy="filters-form">
      <Grid container spacing={2} className="space-y-4">
        {filterGroups}
      </Grid>
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={handleClick}>
          {messages.reset}
        </Button>
        <Button variant="contained" type="submit">
          {messages.filter}
        </Button>
      </Stack>
    </form>
  )
}
FiltersForm.defaultProps = {
  onReset: () => {},
  buttonContainerStyle: {},
}

FiltersForm.propTypes = {
  filters: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  defaultValues: PropTypes.object,
  onReset: PropTypes.func,
  onValuesChange: PropTypes.func,
  buttonContainerStyle: PropTypes.object,
}

export default FiltersForm
