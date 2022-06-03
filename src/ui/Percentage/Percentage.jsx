import PropTypes from 'prop-types'

const Percentage = ({ children }) => `${Number((children * 100).toFixed(2))}%`

Percentage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default Percentage
