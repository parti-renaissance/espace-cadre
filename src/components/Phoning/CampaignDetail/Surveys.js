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
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import { format } from 'date-fns'
import { v1 as uuid } from 'uuid'

import { PhoningCampaignReply as DomainPhoningCampaignReply } from 'domain/phoning'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { TruncatedText } from 'components/shared/styled'
import { multipleChoice, simpleField, uniqueChoice } from './shared/constants'
import { timeDifferenceToString } from './shared/helpers'
import { UIChip } from 'ui/Card'

const TableCell = styled(
  MuiTableCell,
  shouldForwardProps
)(
  ({ theme, isSticky = false }) => `
	padding: ${theme.spacing(1.5, 2)};
	${
    isSticky
      ? `
		position: sticky;
		left: 0;
		background: ${theme.palette.whiteCorner};
	`
      : ''
  }
`
)
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

  const handleChangePage = (_, page) => {
    setCurrentPage(page)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setCurrentPage(0)
  }

  const rows = useMemo(
    () => replies.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage),
    [replies, currentPage, rowsPerPage]
  )
  const columns = useMemo(() => replies?.[0]?.answers.map(({ question }) => question), [replies])

  if (replies.length === 0) return null

  return (
    <Grid item xs={12} sm={6} md={3} lg={12}>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell key={uuid()} sx={{ width: '175px' }} isSticky>
                  <ColumnLabel>{messages.called}</ColumnLabel>
                </TableCell>

                <TableCell key={uuid()} sx={{ width: '150px' }}>
                  <ColumnLabel>{messages.time}</ColumnLabel>
                </TableCell>

                {columns.map(question => (
                  <TableCell key={uuid()} sx={{ width: '245px' }}>
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
                    <Description>{firstName || lastName ? `${firstName} ${lastName}` : messages.anonymous}</Description>
                    <SubDescription></SubDescription>
                  </TableCell>

                  <TableCell key={uuid()} sx={{ width: '150px' }}>
                    <Description>{format(new Date(startDate), 'dd/MM/yyyy hh:mm')}</Description>
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
          component="div"
          page={currentPage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 50, 100]}
          count={replies.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Grid>
  )
}

CampaignDetailSurveys.propTypes = {
  replies: PropTypes.arrayOf(DomainPhoningCampaignReply.propTypes).isRequired,
}

export default CampaignDetailSurveys
