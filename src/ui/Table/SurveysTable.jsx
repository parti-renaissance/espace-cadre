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
import PropTypes from 'prop-types'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { TruncatedText } from 'components/shared/styled'
import SurveysExport from './SurveysExport'
import { multipleChoice, simpleField, translatedGender, uniqueChoice } from './shared/constants'
import { surveysColumnsStyles, secondsToMinutes, timeDifferenceToString } from './shared/helpers'
import { UIChip } from 'ui/Card'

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

const formatCaller = ({ firstName, lastName }) => `${lastName?.toUpperCase()} ${firstName}`
const formatGender = gender => translatedGender[gender]
const formatQuestioner = ({ firstName, lastName }) => `${lastName?.toUpperCase()} ${firstName}`

const SurveysTable = ({
  columns,
  order,
  handleSort,
  rows,
  messages,
  surveysTotalCount,
  currentPage,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  isDTD,
}) => (
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

            {isDTD && (
              <>
                <TableCell key={uuid()} answerType="called">
                  <ColumnLabel>{messages.gender}</ColumnLabel>
                </TableCell>
                <TableCell key={uuid()} answerType="called">
                  <ColumnLabel>{messages.ageRange}</ColumnLabel>
                </TableCell>
                <TableCell key={uuid()} answerType="called">
                  <ColumnLabel>{messages.profession}</ColumnLabel>
                </TableCell>
                <TableCell key={uuid()} answerType="called">
                  <ColumnLabel>{`${messages.lastName} ${messages.firstName}`}</ColumnLabel>
                </TableCell>
                <TableCell key={uuid()} answerType="called">
                  <ColumnLabel>{messages.emailAddress}</ColumnLabel>
                </TableCell>
                <TableCell key={uuid()} answerType="called">
                  <ColumnLabel>{messages.postalCode}</ColumnLabel>
                </TableCell>
              </>
            )}

            {columns.map(({ question, type }) => (
              <TableCell key={uuid()} answerType={type} sx={{ zIndex: 1 }}>
                <TruncateContainer sx={{ width: '230px' }}>
                  <ColumnLabel title={question} isTruncated>
                    {question}
                  </ColumnLabel>
                </TruncateContainer>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows?.map(
            (
              {
                answers,
                questioner,
                startDate,
                duration,
                firstName,
                lastName,
                gender,
                ageRange,
                profession,
                emailAddress,
                postalCode,
                caller,
                endDate,
              },
              index
            ) => (
              <TableRow key={uuid()} sx={{ width: '175px' }}>
                {isDTD && (
                  <>
                    <TableCell key={uuid()} isOdd={!!(index % 2)} isSticky>
                      <Description>
                        {questioner.lastName || questioner.firstName
                          ? formatQuestioner(questioner)
                          : messages.anonymous}
                      </Description>
                      <SubDescription>
                        {formatGender(questioner.gender) && `${formatGender(questioner.gender)}, `}
                        {questioner.age && `${questioner.age} ${messages.years}`}
                      </SubDescription>
                    </TableCell>

                    <TableCell key={uuid()} isOdd={!!(index % 2)} sx={{ width: '150px' }}>
                      {startDate && (
                        <>
                          <Description>{format(startDate, 'dd/MM/yyyy HH:mm')}</Description>
                          <SubDescription>{secondsToMinutes(duration)}</SubDescription>
                        </>
                      )}
                    </TableCell>

                    <TableCell key={uuid()} isOdd={!!(index % 2)}>
                      <Description>{gender || ''}</Description>
                    </TableCell>
                    <TableCell key={uuid()} isOdd={!!(index % 2)}>
                      <Description>{ageRange || ''}</Description>
                    </TableCell>
                    <TableCell key={uuid()} isOdd={!!(index % 2)}>
                      <Description>{profession || ''}</Description>
                    </TableCell>
                    <TableCell key={uuid()} isOdd={!!(index % 2)}>
                      <Description>
                        {lastName || firstName ? `${lastName} ${firstName}` : messages.anonymous}
                      </Description>
                    </TableCell>
                    <TableCell key={uuid()} isOdd={!!(index % 2)}>
                      <Description>{emailAddress || ''}</Description>
                    </TableCell>
                    <TableCell key={uuid()} isOdd={!!(index % 2)}>
                      <Description>{postalCode || ''}</Description>
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
                  </>
                )}
                {!isDTD && (
                  <>
                    <TableCell key={uuid()} isOdd={!!(index % 2)} isSticky>
                      <Description>
                        {caller.lastName || caller.firstName ? formatCaller(caller) : messages.anonymous}
                      </Description>
                      <SubDescription>
                        {formatGender(caller.gender) && `${formatGender(caller.gender)}, `}
                        {caller.age && `${caller.age} ${messages.years}`}
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
                  </>
                )}
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination
      component={({ children, ...props }) => (
        <Grid container justifyContent="space-between" alignItems="center">
          <SurveysExport isDTD />
          <Grid item {...props}>
            {children}
          </Grid>
        </Grid>
      )}
      count={surveysTotalCount}
      page={currentPage}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[10, 25, 50, 100]}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Paper>
)

export default SurveysTable

SurveysTable.propTypes = {
  columns: PropTypes.array.isRequired,
  headers: PropTypes.array,
  order: PropTypes.object,
  handleSort: PropTypes.func,
  rows: PropTypes.array,
  messages: PropTypes.object,
  surveysTotalCount: PropTypes.number,
  currentPage: PropTypes.number,
  rowsPerPage: PropTypes.number,
  handleChangePage: PropTypes.func,
  handleChangeRowsPerPage: PropTypes.func,
  isDTD: PropTypes.bool.isRequired,
}
