import { SvgIcon } from '@mui/material'
import PropTypes from 'prop-types'

export const BarChart = ({ alt }) => (
  <SvgIcon alt={alt}>
    <svg width="48" height="48" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" d="M24 40.0002V20.0002" />
      <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" d="M39 40.0002V8.00024" />
      <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" d="M9 40.0002V32.0002" />
    </svg>
  </SvgIcon>
)

BarChart.propTypes = {
  alt: PropTypes.string.isRequired,
}
