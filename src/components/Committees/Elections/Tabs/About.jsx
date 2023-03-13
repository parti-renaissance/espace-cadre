import { Grid } from '@mui/material'
import { format } from 'date-fns'
import { CommitteeElection } from 'domain/committee_election'
import UICard from 'ui/Card'
import { LineContent } from '../../styles'

const About = ({ election }) => {
  const { designation } = election

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <UICard
          rootProps={{ sx: { overflow: 'hidden', pt: 0.5, pr: 0, pb: 0 } }}
          content={
            <>
              <LineContent label="Titre de l'élection" value={designation.title} />
              <LineContent
                label="Date de début du vote"
                value={format(designation.voteStartDate, 'dd/MM/yyyy à HH:mm:ss')}
              />
              <LineContent
                label="Date de fin du vote"
                value={format(designation.voteEndDate, 'dd/MM/yyyy à HH:mm:ss')}
              />
            </>
          }
        />
      </Grid>
    </Grid>
  )
}

export default About

About.propTypes = {
  election: CommitteeElection.propTypes.isRequired,
}
