import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, createStyles } from '@material-ui/core'
import FiltersForm from './FiltersForm'
import ErrorComponent from '../ErrorComponent'
import Loader from 'ui/Loader'
import { getFilters } from 'api/filters'

const useStyles = makeStyles(() =>
  createStyles({
    loader: {
      textAlign: 'center',
    },
  })
)

const DynamicFilters = ({ feature, values, onSubmit, onReset }) => {
  const [filters, setFilters] = useState([])
  const [errorMessage, setErrorMessage] = useState()
  const classes = useStyles()

  useEffect(() => {
    try {
      getFilters(feature, setFilters)
    } catch (error) {
      setErrorMessage(error)
    }
  }, [feature])

  if (!filters.length) {
    return null
  }

  if (filters.length > 0) {
    return <FiltersForm filters={filters} values={values} onSubmit={onSubmit} onReset={onReset} />
  }

  if (errorMessage) {
    return <ErrorComponent errorMessage={errorMessage} />
  }

  return (
    <div className={`with-background dc-container ${classes.loader}`}>
      <Loader />
    </div>
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
