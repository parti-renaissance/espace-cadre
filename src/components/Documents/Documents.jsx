import { useState } from 'react'
import { saveAs } from 'file-saver'
import {
  Box,
  Container,
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
  Tooltip,
  Button,
} from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import { styled } from '@mui/system'
import { v1 as uuid } from 'uuid'
import { format } from 'date-fns'
import { PaginatedResult } from 'api/pagination'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { getDocuments } from 'api/documents'
import { getFile } from 'api/upload'
import PageHeader from 'ui/PageHeader'
import { useErrorHandler } from 'components/shared/error/hooks'
import { TruncatedText } from 'components/shared/styled'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import EmptyContent from 'ui/EmptyContent'
import MainButton from 'ui/Button/Button'

const messages = {
  title: 'Documents',
  noDocuments: 'Aucun document disponible',
  download: 'Télécharger',
}

const TableCell = styled(
  MuiTableCell,
  shouldForwardProps
)(({ theme, isOdd = false, isSticky = false }) => ({
  padding: theme.spacing(1.5, 2),
  ...(isOdd
    ? {
        backgroundColor: theme.palette.colors.gray[100],
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
}))

const Description = styled(props => <Typography variant="subtitle2" component="div" {...props} />)(
  ({ theme }) => `
	height: 18px;
	color: ${theme.palette.colors.gray[700]};
`
)

const ColumnLabel = styled(({ isTruncated = false, ...props }) =>
  isTruncated ? <TruncatedText variant="subtitle2" {...props} /> : <Typography variant="subtitle2" {...props} />
)(
  ({ theme }) => `
	color: ${theme.palette.colors.gray[800]};
	font-weight: 600;
`
)

const Documents = () => {
  const [defaultFilter] = useState({ page: 1 })
  const [filters, setFilters] = useState(defaultFilter)
  const { handleError } = useErrorHandler()

  const { data: documents = new PaginatedResult([], 0, 0, 0, 0, 0) } = useQueryWithScope(
    ['documents', { feature: 'Documents', view: 'Documents' }],
    () => getDocuments(filters),
    {
      onError: handleError,
    }
  )

  return (
    <Container maxWidth={false}>
      <Grid container justifyContent="space-between">
        <PageHeader title={messages.title} />
      </Grid>

      {(!documents.data || documents.data.length === 0) && <EmptyContent description={messages.noDocuments} />}

      <Paper sx={{ borderRadius: 3 }}>
        {documents.data && documents.data.length > 0 && (
          <TableContainer sx={{ borderRadius: 3 }}>
            <Table sx={{ borderCollapse: 'separate' }} stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell key={uuid()}>
                    <ColumnLabel>Document</ColumnLabel>
                  </TableCell>
                  <TableCell key={uuid()}>
                    <ColumnLabel>Date</ColumnLabel>
                  </TableCell>
                  <TableCell key={uuid()}>
                    <ColumnLabel>Actions</ColumnLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.data.map((document, index) => (
                  <TableRow key={uuid()}>
                    <TableCell key={uuid()} isOdd={!!(index % 2)}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }} className="space-x-2">
                        <span>{document.title}</span>
                        <Tooltip title={document.comment}>
                          <Button sx={{ p: 0, minWidth: 'auto' }}>
                            <HelpIcon sx={{ color: theme => theme.palette.colors.gray[400], fontSize: '20px' }} />
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell key={uuid()} isOdd={!!(index % 2)}>
                      <Description>{format(new Date(document.created_at), 'dd/MM/yyyy hh:mm')}</Description>
                    </TableCell>
                    <TableCell key={uuid()} isOdd={!!(index % 2)}>
                      <MainButton
                        isMainButton
                        onClick={async () => {
                          const { blob, fileName } = await getFile(document.uuid, 'documents')
                          saveAs(blob, fileName)
                        }}
                      >
                        {messages.download}
                      </MainButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {documents.total && (
          <TablePagination
            rowsPerPageOptions={[100]}
            labelRowsPerPage="Lignes par page:"
            component="div"
            count={documents.total || 0}
            page={filters.page - 1}
            onPageChange={(event, page) => setFilters(prevState => ({ ...prevState, ...{ page: page + 1 } }))}
            rowsPerPage={documents.pageSize}
          />
        )}
      </Paper>
    </Container>
  )
}

export default Documents
