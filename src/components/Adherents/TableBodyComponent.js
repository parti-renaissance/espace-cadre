import { TableBody, TableRow, TableCell, Typography } from '@mui/material'
import { styled } from '@mui/system'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import PropTypes from 'prop-types'
import Adherent from 'domain/adherent'

const Interests = styled('span')(({ theme }) => ({
  color: theme.palette.blueCorner,
  background: theme.palette.interestsBubble,
  padding: theme.spacing(0.125, 1),
  borderRadius: '12px',
  '&:not(:last-child)': {
    marginRight: theme.spacing(0.5),
  },
}))

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
  const value = member[columnKeyMapping[column.key] || column.key]

  if (column.type === 'trans' || column.type === 'array|trans') {
    return Array.isArray(value)
      ? value.map(
          (el, index) =>
            column.messages[el] && (
              <Interests key={index}>
                <Typography sx={{ bgcolor: 'palette.blueCorner' }}>{column.messages[el]}</Typography>
              </Interests>
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
  return (
    <TableBody>
      {members.map((adherent, index) => (
        <TableRow
          key={index}
          hover
          sx={{
            '&:hover': {
              background: 'palette.gray100',
            },
          }}
        >
          {columnsTitle.map(column => (
            <TableCell key={`${index}-${column.key}`}>
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
