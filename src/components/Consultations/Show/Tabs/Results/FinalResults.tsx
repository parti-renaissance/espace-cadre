import { Designation } from '~/domain/designation'
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { v1 as uuid } from 'uuid'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { resultsDesignation } from '~/api/designations'
import Loader from '~/ui/Loader'

const FinalResults = ({ designation }: { designation: Designation }) => {
  const { data, isFetching } = useQueryWithScope(['designation-final-results', { id: designation.id }], () =>
    resultsDesignation(designation.id as string)
  )

  const rows = data as any[]

  return (
    <>
      <Typography variant="h5">Résultat</Typography>

      {isFetching ? (
        <Loader isCenter />
      ) : rows.length ? (
        rows.map(row => (
          <Stack key={row.code} spacing={2}>
            <Typography variant="h6">{row.code}</Typography>

            <TableContainer component={Paper} sx={{ border: '1px solid #ccc' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bulletin</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>% de bulletins</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.candidate_group_results.map(candidateGroupResult => (
                    <TableRow key={uuid()}>
                      <TableCell>
                        {candidateGroupResult.candidate_group.title}
                        {candidateGroupResult.candidate_group.elected && ' ⭐'}
                      </TableCell>
                      <TableCell>{candidateGroupResult.total}</TableCell>
                      <TableCell>{candidateGroupResult.rate} %</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>Blanc</TableCell>
                    <TableCell>{row.blank}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        ))
      ) : (
        <Typography>Les résultats ne sont pas encore prêts</Typography>
      )}
    </>
  )
}

export default FinalResults
