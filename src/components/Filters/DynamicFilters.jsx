import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import FiltersForm from './FiltersForm'
import ErrorComponent from '~/components/ErrorComponent'
import Loader from '~/ui/Loader'
import { getFilters } from '~/api/filters'

const DynamicFilters = ({
  feature,
  values,
  onSubmit,
  onReset,
  onValuesChange,
  buttonContainerStyle,
  apiFilters,
  fetchFilters,
}) => {
  const [filters, setFilters] = useState(apiFilters ?? [])
  const [errorMessage, setErrorMessage] = useState()

  useEffect(() => {
    if (apiFilters) {
      setFilters(apiFilters)
    }
  }, [apiFilters])

  useEffect(() => {
    if (fetchFilters && feature) {
      const getColumnsTitle = async () => {
        try {
          await getFilters(feature, setFilters)
        } catch (error) {
          setErrorMessage(error)
        }
      }

      getColumnsTitle()
    }
  }, [fetchFilters, feature])

  if (errorMessage) {
    return <ErrorComponent errorMessage={errorMessage} />
  }

  if (!filters.length) {
    return null
  }

  if (filters.length > 0) {
    return (
      <FiltersForm
        filters={filters}
        values={values}
        onSubmit={onSubmit}
        onReset={onReset}
        buttonContainerStyle={buttonContainerStyle}
        onValuesChange={onValuesChange}
      />
    )
  }

  return <Loader />
}

export default DynamicFilters

DynamicFilters.defaultProps = {
  onReset: null,
  values: {},
  buttonContainerStyle: {},
  fetchFilters: true,
}

DynamicFilters.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  feature: PropTypes.string.isRequired,
  onReset: PropTypes.func,
  onValuesChange: PropTypes.func,
  values: PropTypes.object,
  defaultValues: PropTypes.object,
  buttonContainerStyle: PropTypes.object,
  apiFilters: PropTypes.array,
  fetchFilters: PropTypes.bool,
}
