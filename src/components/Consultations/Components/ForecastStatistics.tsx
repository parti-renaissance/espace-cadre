import { Designation, DesignationType } from '~/domain/designation'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Loader from '~/ui/Loader'
import { format, sub } from 'date-fns'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { countAdherents } from '~/api/activist'
import { getVoters } from '~/api/designations'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { useMemo } from 'react'

type AdherentCountData = {
  adherent: number
  adherent_since: number
}

const ForecastStatistics = ({ designation }: { designation: Designation | DesignationType }) => {
  const { handleError } = useErrorHandler()

  const { data: adherentFetchedCount, isFetching } = useQueryWithScope(['consultation-voters-count'], () =>
    countAdherents([], designation.targetYear as any)
  )

  const adherentCount = adherentFetchedCount as AdherentCountData | undefined

  const { data: voters, isFetching: votersFetching } = useQueryWithScope(
    ['designation-voters', { feature: 'Consultation', view: 'DetailVoters' }, { id: (designation as Designation)?.id }],
    () => getVoters((designation as Designation)?.id as string),
    {
      onError: handleError,
      enabled: !!(designation as Designation)?.id,
    }
  )

  const voteStats = useMemo(() => {
    if (!Array.isArray(voters) || voters.length === 0) {
      return {
        count: null,
        participants: null,
        participationRate: null,
      }
    }

    const participants = voters.filter(row => !!row.voted_at).length

    return {
      count: voters.length,
      participants: participants,
      participationRate: (participants * 100.0) / voters.length,
    }
  }, [voters])

  return (
    <>
      <Typography variant="h6">Statistiques prévisionnelles</Typography>

      <TableContainer component={Paper} sx={{ border: '1px solid #ccc' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Catégorie</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching || votersFetching ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Loader isCenter />
                </TableCell>
              </TableRow>
            ) : (
              <>
                <TableRow>
                  <TableCell>Potentiel électoral</TableCell>
                  <TableCell>{adherentCount?.adherent || 0}</TableCell>
                  <TableCell>
                    <Typography>
                      Adhérents à J-2, {format(designation.voteStartDate, 'HH')}h (ce chiffre varie jusqu’au{' '}
                      {format(sub(designation.voteStartDate, { days: 2 }), 'dd/MM/yyyy, HH:mm')})
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Collège électoral</TableCell>
                  <TableCell>{voteStats.count ?? (adherentCount?.adherent_since || 0)}</TableCell>
                  <TableCell>
                    <Typography>
                      À partir des adhérents à jour {designation.targetYear} (ce chiffre varie jusqu’au{' '}
                      {format(designation.voteEndDate, 'dd/MM/yyyy, HH:mm')})
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Participants</TableCell>
                  <TableCell>{voteStats.participants}</TableCell>
                  <TableCell>
                    <Typography>(ce chiffre varie jusqu’à la fin du vote)</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Taux de participation</TableCell>
                  <TableCell>
                    {voteStats.participationRate}
                    {voteStats.participationRate ? ' %' : ''}
                  </TableCell>
                  <TableCell>
                    <Typography>C’est le seul chiffre affiché à vos adhérents dans les résultats</Typography>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default ForecastStatistics
