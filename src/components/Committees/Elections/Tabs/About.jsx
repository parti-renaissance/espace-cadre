import { useState } from 'react'
import PropTypes from 'prop-types'
import { Alert, Box, Grid, Typography } from '@mui/material'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { getDesignation } from 'api/designations'
import { useErrorHandler } from 'components/shared/error/hooks'
import Status from 'components/Committees/Status'
import { CommitteeElection, Designation } from 'domain/committee_election'
import UICard from 'ui/Card'
import Loader from 'ui/Loader'
import { LineContent } from '../../styles'
import pluralize from 'components/shared/pluralize/pluralize'

const About = ({ election, adherentCount }) => {
  const [designation, setDesignation] = useState(Designation.NULL)
  const { status, votersCount, voteCount } = election
  const { handleError } = useErrorHandler()

  const { isLoading } = useQueryWithScope(
    ['election-designation', { feature: 'Committees', view: 'AboutDesignation' }, election.designation.id],
    () => getDesignation(election.designation.id),
    {
      enabled: !!election.designation.id,
      onSuccess: setDesignation,
      onError: handleError,
    }
  )

  return (
    <Box>
      {isLoading && <Loader />}
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={7}>
          <UICard
            rootProps={{ sx: { overflow: 'hidden', pt: 0.5, pr: 0, pb: 0 } }}
            content={
              <>
                <LineContent label="Titre de l'élection" value={designation.title} />
                <LineContent label="Status" value={<Status status={status} />} />
                <LineContent
                  label="Date de début du vote"
                  value={format(designation.voteStartDate, 'dd MMMM yyyy à HH:mm', { locale: fr })}
                />
                <LineContent
                  label="Date de fin du vote"
                  value={format(designation.voteEndDate, 'dd MMMM yyyy à HH:mm', { locale: fr })}
                />
                <LineContent label="Description" value={designation.description} />
              </>
            }
          />
        </Grid>
        <Grid item xs={12} md={5}>
          {adherentCount < 10 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Attention - Votre comité possède moins de 10 adhérents!
            </Alert>
          )}
          <Box className="ml-4 space-y-4">
            <Typography sx={{ fontSize: '22px', fontWeight: '500', color: theme => theme.palette.colors.gray[900] }}>
              Détails du vote
            </Typography>
            <Box display="flex" alignItems="center" className="space-x-2">
              <Typography component="dt" sx={{ fontSize: '18px', color: theme => theme.palette.colors.gray[500] }}>
                Corps électoral :
              </Typography>
              <Typography
                component="dd"
                sx={{ fontWeight: '600', fontSize: '20px', color: theme => theme.palette.colors.gray[900] }}
              >
                {votersCount} inscrits
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" className="space-x-2">
              <Typography component="dt" sx={{ fontSize: '18px', color: theme => theme.palette.colors.gray[500] }}>
                Participation :
              </Typography>
              <Typography
                component="dd"
                sx={{ fontWeight: '600', fontSize: '20px', color: theme => theme.palette.colors.gray[900] }}
              >
                {voteCount} ({voteCount > 0 ? Math.round((votersCount / voteCount) * 100) : 0} %){' '}
                {pluralize(voteCount, 'votant')}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default About

About.propTypes = {
  election: CommitteeElection.propTypes.isRequired,
  adherentCount: PropTypes.number,
}
