import PropTypes from 'prop-types'

interface PercentageProps {
  children: string | number
}
const Percentage = ({ children }: PercentageProps) => <>{`${(Number(children) * 100).toFixed(2)}%`}</>

Percentage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default Percentage
