import { TableBody, TableRow, TableCell } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import PropTypes from 'prop-types'
import Adherent from 'domain/adherent'

const useStyles = makeStyles(theme =>
  createStyles({
    interestsBubble: {
      backgroundColor: theme.palette.interestsBubble,
      padding: theme.spacing(0.125, 1),
      color: theme.palette.blueCorner,
      borderRadius: '12px',
      '&:not(:last-child)': {
        marginRight: theme.spacing(0.5),
      },
    },
    head: {
      fontSize: '12px',
      fontWeight: '600',
      background: theme.palette.whiteCorner,
      color: theme.palette.gray800,
      minWidth: '110px',
    },
    hoverBackground: {
      '&:hover': {
        background: `${theme.palette.gray100} !important`,
      },
    },
  })
)

const columnKeyMapping = {
  first_name: 'firstname',
  last_name: 'lastname',
  email_subscription: 'emailSubscription',
  sms_subscription: 'smsSubscription',
  postal_code: 'postalCode',
  city_code: 'cityId',
  department_code: 'departmentId',
  region_code: 'regionId',
}

const Cell = ({ member, column }) => {
  const classes = useStyles()
  const value = member[columnKeyMapping[column.key] || column.key]

  if (column.type === 'trans' || column.type === 'array|trans') {
    return Array.isArray(value)
      ? value.map(
          (el, index) =>
            column.messages[el] && (
              <span key={index} className={classes.interestsBubble}>
                {column.messages[el]}
              </span>
            )
        )
      : column.messages[value]
  }

  if (column.type === 'boolean') {
    return value ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />
  }

  return <>{value}</>
}

Cell.propTypes = {
  member: Adherent.propTypes.isRequired,
  column: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    messages: PropTypes.object,
  }).isRequired,
}

const TableBodyComponent = ({ columnsTitle, members }) => {
  const classes = useStyles()

  return (
    <TableBody>
      {members.map((adherent, index) => (
        <TableRow key={index} hover classes={{ hover: classes.hoverBackground }}>
          {columnsTitle.map(column => (
            <TableCell key={`${index}-${column.key}`} classes={{ head: classes.head }}>
              <Cell column={column} member={adherent} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}

TableBodyComponent.propTypes = {
  columnsTitle: PropTypes.arrayOf(Cell.propTypes.column).isRequired,
  members: PropTypes.arrayOf(Adherent.propTypes).isRequired,
}

export default TableBodyComponent
