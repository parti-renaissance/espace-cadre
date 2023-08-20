import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import PropTypes from 'prop-types'

const CotisationHistory = ({ dates }) => (
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
          primary={format(new Date(date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
          primaryTypographyProps={{
            variant: 'span',
            color: 'colors.gray.700',
          }}
        />
      </ListItem>
    ))}
  </List>
)

CotisationHistory.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default CotisationHistory
