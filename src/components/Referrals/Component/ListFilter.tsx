import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { ReferralsListFilter } from '~/components/Referrals/Pages/Referrals'
import { ReferralStatusEnum, ReferralStatusLabels, ReferralType, ReferralTypeLabels } from '~/domain/referral'

type ListFilterProps = {
  filter: ReferralsListFilter
  onFilterUpdate: (updater: (prev: ReferralsListFilter) => ReferralsListFilter) => void
}

const ListFilter = ({ filter, onFilterUpdate }: ListFilterProps) => (
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        fullWidth
        label="Rechercher un parrainé (email, prénom, nom)"
        onChange={({ target }) => onFilterUpdate(prev => ({ ...prev, referred: target.value }))}
      />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <TextField
        fullWidth
        label="Rechercher un parrain (email, prénom, nom)"
        onChange={({ target }) => onFilterUpdate(prev => ({ ...prev, referrer: target.value }))}
      />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <FormControl fullWidth>
        <InputLabel>Statut</InputLabel>
        <Select
          label="Statut"
          value={filter.status || ''}
          onChange={({ target }) => onFilterUpdate(prev => ({ ...prev, status: target.value as ReferralStatusEnum }))}
        >
          <MenuItem value="">Tous</MenuItem>
          {Object.values(ReferralStatusEnum).map(status => (
            <MenuItem key={status} value={status}>
              {ReferralStatusLabels[status]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Select
          label="Type"
          value={filter.type || ''}
          onChange={({ target }) => onFilterUpdate(prev => ({ ...prev, type: target.value as ReferralType }))}
        >
          <MenuItem value="">Tous</MenuItem>
          {Object.values(ReferralType).map(type => (
            <MenuItem key={type} value={type}>
              {ReferralTypeLabels[type]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    {(filter.referred || filter.referrer || filter.type || filter.status) && (
      <Grid container justifyContent="flex-end" mt={2}>
        <Button variant="contained" onClick={() => onFilterUpdate(() => ({ page: 1 }))}>
          Réinitialiser
        </Button>
      </Grid>
    )}
  </Grid>
)

export default ListFilter
