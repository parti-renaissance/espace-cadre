import { TableBody, TableRow, TableCell, makeStyles, createStyles } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'
import PropTypes from 'prop-types'
import Adherent from '../../domain/adherent'

const useStyles = makeStyles(theme =>
  createStyles({
    interestsBubble: {
      backgroundColor: theme.palette.interestsBubble,
      padding: '1px 8px',
      color: theme.palette.blueCorner,
      borderRadius: '12px',
      '&:not(:last-child)': {
        marginRight: '4px',
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

const Cell = ({ adherent, column }) => {
  const classes = useStyles()
  const value = adherent[columnKeyMapping[column.key] || column.key]

  if (column.type === 'trans' || column.type === 'array|trans') {
    return Array.isArray(value)
      ? value.map(
          (el, ind) =>
            column.messages[el] !== undefined && (
              <span key={ind} className={classes.interestsBubble}>
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
  adherent: Adherent.propTypes.isRequired,
  column: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    messages: PropTypes.object,
  }).isRequired,
}

const TableBodyComponent = ({ columnsTitle, adherents }) => {
  const classes = useStyles()

  return (
    <TableBody>
      {adherents.map((adherent, index) => (
        <TableRow key={index} hover classes={{ hover: classes.hoverBackground }}>
          {columnsTitle.map(column => (
            <TableCell key={`${index}-${column.key}`} classes={{ head: classes.head }}>
              <Cell column={column} adherent={adherent} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}

TableBodyComponent.propTypes = {
  columnsTitle: PropTypes.arrayOf(Cell.propTypes.column).isRequired,
  adherents: PropTypes.arrayOf(Adherent.propTypes).isRequired,
}

export default TableBodyComponent
