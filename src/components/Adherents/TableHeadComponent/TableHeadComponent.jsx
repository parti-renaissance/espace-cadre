import { TableHead, TableRow, TableCell } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme =>
  createStyles({
    head: {
      fontSize: '12px',
      fontWeight: '600',
      background: theme.palette.whiteCorner,
      color: theme.palette.gray800,
      minWidth: '110px',
    },
  })
)

function TableHeadComponent({ columnsTitle }) {
  const classes = useStyles()

  return (
    <TableHead>
      <TableRow>
        {columnsTitle &&
          columnsTitle.map(columnTitle => (
            <TableCell key={columnTitle.key} classes={{ head: classes.head }}>
              {columnTitle.label}
            </TableCell>
          ))}
      </TableRow>
    </TableHead>
  )
}

export default TableHeadComponent

TableHeadComponent.propTypes = {
  columnsTitle: PropTypes.arrayOf(Object).isRequired,
}
