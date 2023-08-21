import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
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
import { v1 as uuid } from 'uuid'
import { orderBy } from 'lodash'

import Loading from 'components/Dashboard/shared/Loading'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { getDTDCampaignSurveysReplies } from 'api/DTD'
import { useErrorHandler } from 'components/shared/error/hooks'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { TruncatedText } from 'components/shared/styled'
import { multipleChoice, simpleField, translatedGender, uniqueChoice } from './shared/constants'
import { surveysColumnsStyles, secondsToMinutes } from './shared/helpers'
import { UIChip } from 'ui/Card'
import CampaignDetailSurveysExport from './CampaignDetailSurveysExport'
import { formatDate } from 'shared/helpers'

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
  called: 'Porte-à-porteur',
  time: 'Date (Temps)',
  anonymous: 'Anonyme',
  years: 'ans',
  gender: 'Genre',
  ageRange: "Tranche d'âge",
  profession: 'Profession',
  firstName: 'Prénom',
  lastName: 'Nom',
  emailAddress: 'Email',
  postalCode: 'Code postal',
}

const formatQuestioner = ({ firstName, lastName }) => `${lastName?.toUpperCase()} ${firstName}`
const formatGender = gender => translatedGender[gender]

const CampaignDetailSurveys = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [order, toggleOrder] = useState({ startDate: 'asc' })
  const { handleError } = useErrorHandler()
  const { campaignId } = useParams()

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

  const { data: surveys = {}, isLoading: isSurveysLoading } = useQueryWithScope(
    [
      'surveys-detail',
      { feature: 'DTD', view: 'CampaignDetailSurveys', pageNumber: currentPage, pageSize: rowsPerPage },
      campaignId,
    ],
    () => getDTDCampaignSurveysReplies({ campaignId, pageSize: rowsPerPage, pageNumber: currentPage }),
    {
      onError: handleError,
    }
  )
  const surveysTotalCount = surveys?.totalCount
  const replies = surveys?.replies

  const columns = useMemo(() => replies?.[0]?.answers.map(({ question, type }) => ({ question, type })), [replies])
  const rows = useMemo(
    () => orderBy(replies, Object.keys(order).reverse(), Object.values(order).reverse()),
    [replies, order]
  )

  if (replies?.length === 0) {
    return null
  }
  if (isSurveysLoading) {
    return <Loading />
  }

  return (
    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} data-cy="campaign-campaign-detail-surveys">
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

                {columns.map(({ question, type }) => (
                  <TableCell key={uuid()} answerType={type} sx={{ zIndex: 1 }}>
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
                  },
                  index
                ) => (
                  <TableRow key={uuid()} sx={{ width: '175px' }}>
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
                          <Description>{formatDate(startDate, 'dd/MM/yyyy HH:mm')}</Description>
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
                  </TableRow>
                )
              )}
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
          count={surveysTotalCount}
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

export default CampaignDetailSurveys
