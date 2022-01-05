import { useState } from 'react'
import { Button, Grid } from '@mui/material'
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

const FiltersForm = ({ filters, onSubmit, onReset, values }) => {
  const [localValues, setLocalValues] = useState(values)
  const factory = new Factory()

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
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {filterElements}
      </Grid>
      <Grid container sx={{ mb: 2 }}>
        <FilterButton type="submit">{messages.filter}</FilterButton>
        <ResetButton onClick={handleClick}>{messages.reset}</ResetButton>
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
