import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import { format } from 'date-fns'
import { v1 as uuid } from 'uuid'
import { orderBy } from 'lodash'

import { PhoningCampaignReply as DomainPhoningCampaignReply } from 'domain/phoning'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { TruncatedText } from 'components/shared/styled'
import { multipleChoice, simpleField, uniqueChoice } from './shared/constants'
import { surveysColumnsStyles, timeDifferenceToString } from './shared/helpers'
import { UIChip } from 'ui/Card'
import CampaignDetailSurveysExport from './CampaignDetailSurveysExport'

const TableCell = styled(
  MuiTableCell,
  shouldForwardProps
)(({ theme, isSticky = false, answerType }) => ({
  padding: theme.spacing(1.5, 2),
  ...(isSticky
    ? {
        position: 'sticky',
        left: 0,
        background: theme.palette.whiteCorner,
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
const TruncateContainer = styled('div')`
  display: flex;
`
const Description = styled(props => <Typography variant="subtitle2" component="div" {...props} />)(
  ({ theme }) => `
	height: 18px;
	color: ${theme.palette.gray700};
	font-weight: 500;
`
)
const SubDescription = styled(props => <Typography component="div" {...props} />)(
  ({ theme }) => `
	height: 15px;
	color: ${theme.palette.gray600};
	font-size: 10px;
	font-weight: 400;
	line-height: 15px;
`
)

const messages = {
  called: 'Appelé',
  time: 'Date (Temps)',
  anonymous: 'Anonyme',
}

const CampaignDetailSurveys = ({ replies }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [order, toggleOrder] = useState({ startDate: 'asc' })

  const handleChangePage = (_, page) => {
    setCurrentPage(page)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setCurrentPage(0)
  }

  const handleSort = column => () => {
    toggleOrder(order => ({ ...order, [column]: order[column] === 'asc' ? 'desc' : 'asc' }))
  }

  const columns = useMemo(() => replies?.[0]?.answers.map(({ question, type }) => ({ question, type })), [replies])
  const rows = useMemo(() => {
    const rows = replies.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
    return orderBy(rows, Object.keys(order).reverse(), Object.values(order).reverse())
  }, [replies, currentPage, rowsPerPage, order])

  if (replies.length === 0) return null

  return (
    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} data-cy="phoning-campaign-detail-surveys">
      <Paper sx={{ borderRadius: 3 }}>
        <TableContainer sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell key={uuid()} answerType="called" isSticky>
                  <ColumnLabel>{messages.called}</ColumnLabel>
                </TableCell>

                <TableCell key={uuid()} answerType="time">
                  <TableSortLabel direction={order.startDate} onClick={handleSort('startDate')} active>
                    <ColumnLabel>{messages.time}</ColumnLabel>
                  </TableSortLabel>
                </TableCell>

                {columns.map(({ question, type }) => (
                  <TableCell key={uuid()} answerType={type}>
                    <TruncateContainer sx={{ width: '245px' }}>
                      <ColumnLabel title={question} isTruncated>
                        {question}
                      </ColumnLabel>
                    </TruncateContainer>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map(({ answers, firstName, lastName, startDate, endDate }) => (
                <TableRow key={uuid()} sx={{ width: '175px' }}>
                  <TableCell key={uuid()} isSticky>
                    <Description>
                      {lastName || firstName ? `${lastName?.toUpperCase()} ${firstName}` : messages.anonymous}
                    </Description>
                    <SubDescription></SubDescription>
                  </TableCell>

                  <TableCell key={uuid()} sx={{ width: '150px' }}>
                    <Description>{format(startDate, 'dd/MM/yyyy hh:mm')}</Description>
                    {timeDifferenceToString(startDate, endDate) && (
                      <SubDescription>{timeDifferenceToString(startDate, endDate)}</SubDescription>
                    )}
                  </TableCell>

                  {answers.map(({ type, answer }) => (
                    <TableCell key={uuid()} sx={{ width: '245px' }}>
                      {answer && (
                        <>
                          {type === simpleField && (
                            <TruncateContainer>
                              <TruncatedText key={uuid()} variant="subtitle2" lines={2} sx={{ color: 'gray700' }}>
                                {answer}
                              </TruncatedText>
                            </TruncateContainer>
                          )}
                          {type === uniqueChoice && (
                            <UIChip variant="outlined" key={uuid()} label={answer[0]} sx={{ mr: 1 }} />
                          )}
                          {type === multipleChoice &&
                            answer.map(answerContent => (
                              <UIChip
                                key={uuid()}
                                variant="outlined"
                                color="gray700"
                                label={answerContent}
                                sx={{ mr: 1, my: 0.5 }}
                              />
                            ))}
                        </>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component={({ children, ...props }) => (
            <Grid container justifyContent="space-between" alignItems="center">
              <CampaignDetailSurveysExport />
              <Grid item {...props}>
                {children}
              </Grid>
            </Grid>
          )}
          count={replies.length}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Grid>
  )
}

CampaignDetailSurveys.propTypes = {
  replies: PropTypes.arrayOf(PropTypes.shape(DomainPhoningCampaignReply.propTypes)).isRequired,
}

export default CampaignDetailSurveys
