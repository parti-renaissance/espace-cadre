import { SvgIcon } from '@mui/material'
import PropTypes from 'prop-types'

export const Phone = ({ alt }) => (
  <SvgIcon alt={alt}>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path
        stroke="#717BA0"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14.1665 1.66666H5.83317C4.9127 1.66666 4.1665 2.41285 4.1665 3.33332V16.6667C4.1665 17.5871 4.9127 18.3333 5.83317 18.3333H14.1665C15.087 18.3333 15.8332 17.5871 15.8332 16.6667V3.33332C15.8332 2.41285 15.087 1.66666 14.1665 1.66666Z"
      />
      <path stroke="#717BA0" strokeLinecap="round" strokeWidth="2" d="M10 15H10.0083" />
    </svg>
  </SvgIcon>
)

Phone.propTypes = {
  alt: PropTypes.string.isRequired,
}
