import { TableHead, TableRow, TableCell as MuiTableCell, Typography as MuiTypography } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'

const Typography = styled(MuiTypography)`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.gray800};
`

const TableCell = styled(MuiTableCell)(`
  &.MuiTableCell-head {
    background: ${({ theme }) => theme.palette.whiteCorner};
    min-width: 110px;
  }
`)

const TableHeadComponent = ({ columnsTitle }) => (
  <TableHead>
    <TableRow>
      {columnsTitle.map(columnTitle => (
        <TableCell key={columnTitle.key}>
          <Typography>{columnTitle.label}</Typography>
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
)

export default TableHeadComponent

TableHeadComponent.propTypes = {
  columnsTitle: PropTypes.arrayOf(Object).isRequired,
}
