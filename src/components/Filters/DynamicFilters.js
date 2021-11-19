import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import FiltersForm from './FiltersForm'
import ErrorComponent from '../ErrorComponent'
import Loader from 'ui/Loader'
import { getFilters } from 'api/filters'
import UIContainer from 'ui/UIContainer'

const useStyles = makeStyles(() => ({
  loader: {
    textAlign: 'center',
  },
}))

const DynamicFilters = ({ feature, values, onSubmit, onReset }) => {
  const [filters, setFilters] = useState([])
  const [errorMessage, setErrorMessage] = useState()
  const classes = useStyles()

  useEffect(() => {
    const getColumnsTitle = async () => {
      try {
        await getFilters(feature, setFilters)
      } catch (error) {
        setErrorMessage(error)
      }
    }

    getColumnsTitle()
  }, [feature])

  if (errorMessage) {
    return <ErrorComponent errorMessage={errorMessage} />
  }

  if (!filters.length) {
    return null
  }

  if (filters.length > 0) {
    return <FiltersForm filters={filters} values={values} onSubmit={onSubmit} onReset={onReset} />
  }

  return (
    <UIContainer rootClasses={classes.loader}>
      <Loader />
    </UIContainer>
  )
}

export default DynamicFilters

DynamicFilters.defaultProps = {
  onReset: null,
  values: {},
}

DynamicFilters.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  feature: PropTypes.string.isRequired,
  onReset: PropTypes.func,
  values: PropTypes.object,
  defaultValues: PropTypes.object,
}
