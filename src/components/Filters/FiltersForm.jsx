import { useState } from 'react'
import { Box, Button, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import Factory from './FiltersFactory/Factory'

const FilterButton = styled(Button)(
  ({ theme }) => `
  color: ${theme.palette.whiteCorner};
  background: ${theme.palette.gray700};
  margin-right: ${theme.spacing(2)};
  border-radius: 8px;
  &:hover {
    background: ${theme.palette.gray600};
  }
`
)

const ResetButton = styled(Button)(
  ({ theme }) => `
  color: ${theme.palette.gray700};
  border: 1px solid ${theme.palette.gray300};
  border-radius: 8px;
  &:hover {
    background: ${theme.palette.gray200};
  }
`
)

const messages = {
  filter: 'Filtrer',
  reset: 'Réinitialiser',
}

const FiltersForm = ({ filters, onSubmit, onReset, values, onValuesChange, buttonContainerStyle }) => {
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
        <Grid item key={filter.code} xs={12} sm={6} lg={4}>
          {filterElement}
        </Grid>
      )
    })

    return (
      <Box key={`form-group-${index}`} sx={{ px: 2, width: '100%' }}>
        <Typography
          component="p"
          sx={{
            display: 'inline-flex',
            fontSize: '14px',
            bgcolor: group.color,
            color: 'whiteCorner',
            py: 0.5,
            px: 1.5,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        >
          {group.label}
        </Typography>
        <Box
          sx={{
            border: '1px solid',
            borderColor: group.color,
            borderRadius: 2,
            borderTopLeftRadius: 0,
            p: 1.5,
          }}
        >
          <Grid container spacing={2}>
            {filterElements}
          </Grid>
        </Box>
      </Box>
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
      <Grid container spacing={2} sx={{ py: 2 }} className="space-y-4">
        {filterGroups}
      </Grid>
      <Grid sx={{ mb: 2, ...buttonContainerStyle }}>
        <FilterButton type="submit">{messages.filter}</FilterButton>
        <ResetButton onClick={handleClick}>{messages.reset}</ResetButton>
      </Grid>
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
