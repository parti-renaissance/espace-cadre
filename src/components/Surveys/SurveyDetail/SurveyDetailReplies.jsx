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

import { SurveyDetailReply as DomainSurveyDetailReply } from 'domain/surveys'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { TruncatedText } from 'components/shared/styled'
import { multipleChoice, simpleField, translatedGender, uniqueChoice } from '../shared/constants'
import { surveysColumnsStyles, timeDifferenceToString } from '../shared/helpers'
import { UIChip } from 'ui/Card'
import CampaignDetailSurveysExport from './SurveyDetailRepliesExport'

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
  years: 'ans',
}

const formatAuthor = ({ firstName, lastName }) => `${lastName?.toUpperCase()} ${firstName}`
const formatGender = gender => translatedGender[gender]

const SurveyDetailReplies = ({ surveyTitle, replies }) => {
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
    <Grid item xs={12} data-cy="survey-detail-replies">
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

                {columns.map(({ question, type }) => (
                  <TableCell key={uuid()} answerType={type} sx={{ zIndex: 1 }}>
                    <TruncateContainer sx={{ width: '216px' }}>
                      <ColumnLabel title={question} isTruncated>
                        {question}
                      </ColumnLabel>
                    </TruncateContainer>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map(({ answers, author, startDate, endDate }, index) => (
                <TableRow key={uuid()} sx={{ width: '175px' }}>
                  <TableCell key={uuid()} isOdd={!!(index % 2)} isSticky>
                    <Description>
                      {author?.lastName || author?.firstName ? formatAuthor(author) : messages.anonymous}
                    </Description>
                    <SubDescription>
                      {formatGender(author?.gender) && `${formatGender(author.gender)}, `}
                      {author?.age && `${author.age} ${messages.years}`}
                    </SubDescription>
                  </TableCell>

                  <TableCell key={uuid()} isOdd={!!(index % 2)} sx={{ width: '150px' }}>
                    <Description>{format(startDate, 'dd/MM/yyyy hh:mm')}</Description>
                    {timeDifferenceToString(startDate, endDate) && (
                      <SubDescription>{timeDifferenceToString(startDate, endDate)}</SubDescription>
                    )}
                  </TableCell>

                  {answers.map(({ type, answer }) => (
                    <TableCell key={uuid()} isOdd={!!(index % 2)} sx={{ width: '245px' }}>
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
              <CampaignDetailSurveysExport surveyTitle={surveyTitle} />
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

SurveyDetailReplies.propTypes = {
  surveyTitle: PropTypes.string.isRequired,
  replies: PropTypes.arrayOf(PropTypes.shape(DomainSurveyDetailReply.propTypes)).isRequired,
}

export default SurveyDetailReplies
