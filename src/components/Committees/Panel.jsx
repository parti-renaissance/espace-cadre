import { Box } from '@mui/material'
import PropTypes from 'prop-types'

const TabPanel = ({ children, value, index, ...props }) => (
  <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...props}>
    {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
  </div>
)

export default TabPanel

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}
