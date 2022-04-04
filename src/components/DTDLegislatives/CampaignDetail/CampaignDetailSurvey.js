import { useState } from 'react'
import {
  Grid,
  Paper,
  Table,
  TableCell as MuiTableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { TruncatedText } from 'components/shared/styled'
import { surveysColumnsStyles } from './shared/helpers'

import { v1 as uuid } from 'uuid'

const TableCell = styled(
  MuiTableCell,
  shouldForwardProps
)(({ theme, isOdd = false, isSticky = false, answerType }) => ({
  padding: theme.spacing(1.5, 2),
  ...(isOdd
    ? {
        backgroundColor: theme.palette.campaign.background.table.cell.odd,
      }
    : {}),
  ...(isSticky
    ? {
        position: 'sticky',
        left: 0,
        backgroundColor: theme.palette.campaign.background.table.cell[isOdd ? 'odd' : 'even'],
        borderRight: `1px solid ${theme.palette.campaign.background.table.cell.border}`,
      }
    : {}),
  ...surveysColumnsStyles[answerType],
}))
const ColumnLabel = styled(({ isTruncated = false, ...props }) =>
  isTruncated ? <TruncatedText variant="subtitle2" {...props} /> : <Typography variant="subtitle2" {...props} />
)(
  ({ theme }) => `
      color: ${theme.palette.gray800};
      font-weight: 600;
  `
)

const messages = {
  called: 'Appelé',
  time: 'Date (Temps)',
}

const CampaignDetailSurvey = () => {
  const [order, toggleOrder] = useState({ startDate: 'asc' })

  const handleSort = column => () => {
    toggleOrder(order => ({ ...order, [column]: order[column] === 'asc' ? 'desc' : 'asc' }))
  }

  return (
    <Grid item xs={12}>
      <Paper sx={{ borderRadius: 3 }}>
        <TableContainer sx={{ borderRadius: 3 }}>
          <Table sx={{ borderCollapse: 'separate' }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell key={uuid()} answerType="called" isSticky>
                  <ColumnLabel>{messages.called}</ColumnLabel>
                </TableCell>

                <TableCell key={uuid()} answerType="time" sx={{ zIndex: 1 }}>
                  <TableSortLabel direction={order.startDate} onClick={handleSort('startDate')} active>
                    <ColumnLabel>{messages.time}</ColumnLabel>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  )
}

export default CampaignDetailSurvey
