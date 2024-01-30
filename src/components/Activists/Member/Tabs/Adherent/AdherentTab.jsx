import { Box, Grid, Typography } from '@mui/material'
import { MemberBadge } from '~/components/Activists/Badges'
import { UIChip } from '~/ui/Card'
import CotisationHistory from '~/components/Activists/Member/Tabs/Adherent/CotisationHistory'
import Activist from '~/domain/activist'
import LineText from '~/components/Activists/Member/LineText'
import { formatDate } from '~/shared/helpers'

const AdherentTab = ({ member }) => (
  <Box sx={{ mt: 2 }} className="space-y-4">
    <Box
      sx={{
        bgcolor: 'colors.gray.50',
        px: 2,
        py: 2.5,
        borderRadius: 2,
      }}
    >
      <Typography component="h4" sx={{ color: 'colors.gray.700', fontSize: '14px', mb: 1, fontWeight: '500' }}>
        Informations personnelles
      </Typography>
      <LineText label="Adresse complète" value={`${member.raw.address}, ${member.city} ${member.postalCode}`} />
      <Grid container spacing={1}>
        <Grid item xs={12} sm={4}>
          <LineText label="Nationalité" value={member.raw.nationality ?? '--'} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <LineText label="Civilité" value={member.gender === 'male' ? 'Homme' : 'Femme'} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <LineText
            label="Date de naissance"
            value={member.raw.birthdate ? formatDate(member.raw.birthdate, 'dd/MM/yyyy') : '--'}
          />
        </Grid>
      </Grid>
    </Box>

    <Box
      sx={{
        bgcolor: 'colors.gray.50',
        px: 2,
        py: 2.5,
        borderRadius: 2,
      }}
    >
      <Typography component="h4" sx={{ color: 'colors.gray.700', fontSize: '14px', mb: 1, fontWeight: '500' }}>
        Informations globales
      </Typography>
      {member.committee && <LineText label="Comité" value={member.committee} />}
      <Grid container spacing={1}>
        <Grid item xs={12} sm={7}>
          <LineText
            label="Renaissance"
            value={<MemberBadge membership={member.raw.renaissance_membership} labelStyle={{ fontSize: '14px' }} />}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <LineText label="Date d'inscription" value={formatDate(member.joinedDate, 'dd/MM/yyyy')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LineText label="Campus" value={member.raw.campus_registered_at ? 'Inscrit' : 'Non inscrit'} />
        </Grid>
      </Grid>
      <Box
        sx={{
          borderTop: '1px solid',
          borderTopColor: 'colors.gray.200',
          pt: 0.5,
          mt: 1,
        }}
      >
        <LineText
          label="Intérêts"
          value={
            <Box display="flex" alignItems="center" flexWrap="wrap" className="space-x-2 space-y-1">
              {(member.interests.length > 0 &&
                member.interests.map((interest, index) => (
                  <UIChip
                    key={index}
                    label={interest}
                    color="colors.blue.500"
                    bgcolor="colors.blue.50"
                    labelStyle={{ fontSize: '14px' }}
                  />
                ))) ||
                '--'}
            </Box>
          }
        />
      </Box>
    </Box>

    <Box
      sx={{
        bgcolor: 'colors.gray.50',
        px: 2,
        py: 2.5,
        borderRadius: 2,
      }}
    >
      <LineText
        label="Historique des cotisations"
        labelStyle={{ fontSize: '16px', color: 'colors.gray.800', fontWeight: '500' }}
        value={<CotisationHistory dates={member.raw.cotisation_dates} />}
      />
    </Box>
  </Box>
)

export default AdherentTab

AdherentTab.propTypes = {
  member: Activist.propTypes,
}
