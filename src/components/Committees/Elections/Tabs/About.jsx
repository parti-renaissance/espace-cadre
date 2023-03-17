import PropTypes from 'prop-types'
import { Alert, Box, Grid, Typography } from '@mui/material'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Status from 'components/Committees/Status'
import pluralize from 'components/shared/pluralize/pluralize'
import { Designation } from 'domain/committee_election'
import UICard from 'ui/Card'
import { LineContent } from '../../styles'

const About = ({ status, votersCount, voteCount, designation, adherentCount }) => (
  <Box>
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
              {votersCount} {pluralize(votersCount, 'inscrit')}
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
              {voteCount} ({votersCount > 0 ? Math.round((voteCount * 100) / votersCount) : 0} %){' '}
              {pluralize(voteCount, 'votant')}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Box>
)

export default About

About.propTypes = {
  status: PropTypes.string,
  votersCount: PropTypes.number,
  voteCount: PropTypes.number,
  designation: Designation.propTypes.isRequired,
  adherentCount: PropTypes.number,
}
