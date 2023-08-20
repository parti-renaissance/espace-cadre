import PropTypes from 'prop-types'
import { Alert, Box, Grid, Typography } from '@mui/material'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import HowToVoteOutlinedIcon from '@mui/icons-material/HowToVoteOutlined'
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined'
import GroupRemoveOutlinedIcon from '@mui/icons-material/GroupRemoveOutlined'
import { differenceInDays } from 'date-fns'
import Status from 'components/Committees/Status'
import pluralize from 'components/shared/pluralize/pluralize'
import { electionStatus } from 'components/Committees/constants'
import { nl2br } from 'components/shared/helpers'
import { Designation } from 'domain/committee_election'
import UICard from 'ui/Card'
import { LineContent, ResultCard } from '../../styles'
import ConfirmButton from 'ui/Button/ConfirmButton'
import { formatDate } from 'shared/helpers'

const About = ({ status, votersCount, voteCount, designation, adherentCount, results, cancelElection }) => (
  <Box>
    <Grid container spacing={2} sx={{ mt: 0.5 }}>
      <Grid item xs={12} md={6}>
        <UICard
          rootProps={{ sx: { overflow: 'hidden', pt: 0.5, pr: 0, pb: 0 } }}
          content={
            <>
              <LineContent label="Titre de l'élection" value={designation.customTitle} />
              <LineContent
                label="Status"
                value={
                  <Box display="flex" alignItems="center" justifyContent="space-between" pr={1.5}>
                    <Status status={status} />
                    {![electionStatus.closed, electionStatus.canceled].includes(status) && (
                      <ConfirmButton
                        title="Annulation de l'élection"
                        description="Êtes-vous sûr de vouloir annuler cette élection ? Cette action est irréversible"
                        onClick={cancelElection}
                        isDangerButton
                      >
                        Annuler
                      </ConfirmButton>
                    )}
                  </Box>
                }
              />
              <LineContent
                label="Date d'ouverture du vote"
                value={formatDate(designation.voteStartDate, 'dd MMMM yyyy à HH:mm')}
              />
              <LineContent
                label="Date de clôture du vote"
                value={formatDate(designation.voteEndDate, 'dd MMMM yyyy à HH:mm')}
              />
              <LineContent label="Description" value={nl2br(designation.description, {}, 5)} />
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
        <UICard
          rootProps={{ sx: { overflow: 'hidden', ml: 2, pt: 1.5, pr: 0, pb: 0 } }}
          content={
            <>
              <Box>
                <Typography sx={{ px: 1, fontSize: '20px', fontWeight: '500', color: 'colors.gray.900' }}>
                  Détails du vote
                </Typography>
                {electionStatus.not_started === status ? (
                  <LineContent
                    label={`J-${differenceInDays(
                      designation.electionDate,
                      new Date()
                    )} avant constitution du corps électoral`}
                  />
                ) : (
                  <LineContent label="Corps électoral" value={`${votersCount} ${pluralize(votersCount, 'inscrit')}`} />
                )}
                {electionStatus.not_started !== status && (
                  <LineContent
                    label="Participation"
                    value={`${voteCount} (${
                      votersCount > 0 ? ((voteCount * 100) / votersCount).toFixed(2) : 0
                    } %) ${pluralize(voteCount, 'votant')}`}
                  />
                )}
              </Box>
              {status === electionStatus.closed && results && (
                <Box py={2}>
                  <Typography sx={{ px: 1, fontSize: '20px', fontWeight: '500', color: 'colors.gray.900' }}>
                    Résultats du vote
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1.5, px: 1 }}>
                    <ResultCard
                      title="Participants"
                      icon={<PeopleAltOutlinedIcon sx={{ fontSize: '24px', color: 'colors.blue.500' }} />}
                      value={results.participated}
                    />
                    <ResultCard
                      title="Exprimés"
                      icon={<BallotOutlinedIcon sx={{ fontSize: '24px', color: 'colors.blue.500' }} />}
                      value={results.expressed}
                    />
                    <ResultCard
                      title="Blancs"
                      icon={<HowToVoteOutlinedIcon sx={{ fontSize: '24px', color: 'colors.blue.500' }} />}
                      value={results.blank}
                    />
                    <ResultCard
                      title="Abstentions"
                      icon={<GroupRemoveOutlinedIcon sx={{ fontSize: '24px', color: 'colors.blue.500' }} />}
                      value={results.abstentions}
                    />
                  </Grid>
                </Box>
              )}
            </>
          }
        />
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
  results: PropTypes.object,
  cancelElection: PropTypes.func,
}
