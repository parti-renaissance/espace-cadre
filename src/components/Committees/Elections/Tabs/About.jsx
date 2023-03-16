import PropTypes from 'prop-types'
import { Alert, Box, Grid } from '@mui/material'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CommitteeElection } from 'domain/committee_election'
import UICard, { UIChip } from 'ui/Card'
import { LineContent } from '../../styles'

const About = ({ election, adherentCount }) => {
  const { designation } = election

  return (
    <Box>
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={6}>
          <UICard
            rootProps={{ sx: { overflow: 'hidden', pt: 0.5, pr: 0, pb: 0 } }}
            content={
              <>
                <LineContent label="Titre de l'élection" value={designation.title} />
                <LineContent
                  label="Status"
                  value={
                    <>
                      <UIChip label="A venir" color="teal700" bgcolor="activeLabel" />
                    </>
                  }
                />
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
        <Grid item xs={12} md={6}>
          {adherentCount < 10 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Attention - Votre comité possède moins de 10 adhérents!
            </Alert>
          )}
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
