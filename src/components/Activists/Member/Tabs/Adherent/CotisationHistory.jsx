import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import PropTypes from 'prop-types'
import { formatDate } from 'shared/helpers'

const CotisationHistory = ({ dates }) =>
  (dates.length > 0 && (
    <List>
      {dates.map((date, idx) => (
        <ListItem
          key={idx}
          sx={{
            px: 0,
            borderBottom: '1px solid',
            borderColor: 'colors.gray.200',
          }}
        >
          <ListItemIcon>
            <EventAvailableOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary={formatDate(new Date(date), 'dd MMMM yyyy à HH:mm')}
            primaryTypographyProps={{
              variant: 'span',
              color: 'colors.gray.700',
            }}
          />
        </ListItem>
      ))}
    </List>
  )) ||
  '--'

CotisationHistory.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default CotisationHistory
