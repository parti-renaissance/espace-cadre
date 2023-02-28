import { styled } from '@mui/system'
import { ListItemButton, Typography, Grid } from '@mui/material'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import PropTypes from 'prop-types'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { zoneLabels } from 'domain/zone'

const ListItem = styled(
  ListItemButton,
  shouldForwardProps
)(
  ({ theme, hasBorderColor }) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  &.MuiListItemButton-root {
    border: 1px solid ${hasBorderColor ? theme.palette.colors.blue[500] : 'rgba(0, 0, 0, 0.25)'};
  }
`
)

const Badge = styled('span')(({ theme }) => ({
  backgroundColor: theme.palette.colors.blue[100],
  color: theme.palette.colors.blue[600],
  borderRadius: '4px',
  padding: '2px 4px',
  fontSize: '12px',
  fontWeight: '500',
  marginLeft: '4px',
}))

const GridContainer = styled(
  Grid,
  shouldForwardProps
)(
  () => `
  display: flex;
  justify-content: start;
  flex-direction: row;
  align-items: center;
  width: 100%;
`
)

const ZoneItem = ({ zone, handleSelectOne, isCheck }) => (
  <ListItem hasBorderColor={isCheck} onClick={e => handleSelectOne(e, zone)}>
    <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Checkbox checked={isCheck} />
    </Grid>
    <GridContainer>
      <Typography sx={{ fontWeight: 700, mr: 1 }}>
        {zone.name} ({zone.code})
      </Typography>
      - <Badge>{zoneLabels[zone.type]}</Badge>
    </GridContainer>
  </ListItem>
)

export default ZoneItem

ZoneItem.propTypes = {
  zone: PropTypes.object,
  handleSelectOne: PropTypes.func,
  isCheck: PropTypes.bool,
}
