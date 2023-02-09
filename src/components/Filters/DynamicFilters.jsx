import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import FiltersForm from './FiltersForm'
import ErrorComponent from 'components/ErrorComponent'
import Loader from 'ui/Loader'
import { getFilters } from 'api/filters'

const DynamicFilters = ({ feature, values, onSubmit, onReset }) => {
  const [filters, setFilters] = useState([])
  const [errorMessage, setErrorMessage] = useState()

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

  return <Loader />
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
