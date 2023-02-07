import { TableBody, TableRow, TableCell, Typography } from '@mui/material'
import { styled } from '@mui/system'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import PropTypes from 'prop-types'
import Activist from 'domain/activist'

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
  postal_code: 'postalCode',
  city_code: 'cityId',
  department_code: 'departmentId',
  region_code: 'regionId',
}

const Cell = ({ member, column }) => {
  const value = member.getValue(columnKeyMapping[column.key] || column.key)

  if (column.type === 'trans' || column.type === 'array|trans') {
    if (Array.isArray(value)) {
      return value
        .filter(el => el !== '')
        .map((el, index) => {
          return (
            <Interests key={index}>
              <Typography sx={{ bgcolor: 'palette.blueCorner' }}>
                {typeof column.messages[el] !== 'undefined' ? column.messages[el] : el}
              </Typography>
            </Interests>
          )
        })
    }

    if (typeof column.messages[value] !== 'undefined') {
      return column.messages[value]
    }

    return value
  }

  if (column.type === 'boolean') {
    return value ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />
  }

  return <>{value}</>
}

Cell.propTypes = {
  member: Activist.propTypes.isRequired,
  column: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    messages: PropTypes.object,
  }).isRequired,
}

const TableBodyComponent = ({ columnsTitle, members }) => (
  <TableBody>
    {members.map((activist, index) => (
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
            <Cell column={column} member={activist} />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
)

TableBodyComponent.propTypes = {
  columnsTitle: PropTypes.arrayOf(Cell.propTypes.column).isRequired,
  members: PropTypes.arrayOf(Activist.propTypes).isRequired,
}

export default TableBodyComponent
