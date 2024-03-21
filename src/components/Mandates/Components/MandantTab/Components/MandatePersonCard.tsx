import { Button, Chip, Grid, Paper } from '@mui/material'
import { MuiSpacing, withBottomSpacing } from '~/theme/spacing'
import PersonWithAvatar from '~/components/Mandates/Components/PersonWithAvatar/PersonWithAvatar'
import MandatePeopleNumber from '~/components/Mandates/Components/MandantTab/Components/MandatePeopleNumber'
import MandateCardEntry from '~/components/Mandates/Components/MandantTab/Components/MandateCardEntry'
import { KeyValueModel } from '~/models/common.model'
import Divider from '@mui/material/Divider'
import Iconify from '~/mui/iconify'

interface Props {
  firstName: string
  lastName: string
  avatarUrl?: string
  tags: string[]
  peopleInSameVotePlace: number
  votePlace: string
  location: string
  id: string
  expanded?: boolean
  extraInfos?: KeyValueModel[]
  onExpend?: (id: string) => void
  onNarrow?: (id: string) => void
}

export default function MandatePersonCard(props: Props) {
  return (
    <Paper sx={{ mb: MuiSpacing.normal, p: MuiSpacing.normal, border: '1px solid #919EAB33' }}>
      <Grid container alignItems="center" rowSpacing={MuiSpacing.normal} sx={{ mb: MuiSpacing.large }}>
        <Grid item xs={6} md={4}>
          <PersonWithAvatar firstName={props.firstName} lastName={props.lastName} src={props.avatarUrl} id={props.id} />
        </Grid>

        <Grid item xs={6} md={8} textAlign="right">
          <Button onClick={() => {}} variant={'contained'}>
            Trouver un mandataire
          </Button>
        </Grid>

        <Grid item xs={12}>
          {props.tags.map(el => (
            <Chip label={el} key={el} color="primary" />
          ))}
        </Grid>
      </Grid>

      <Grid container sx={{ mb: MuiSpacing.large }}>
        <Grid item xs={12}>
          <MandatePeopleNumber count={props.peopleInSameVotePlace} />
        </Grid>
      </Grid>

      <MandateCardEntry title={'Bureau de vote'} value={props.votePlace} />
      <MandateCardEntry title={'Commune, pays...'} value={props.location} />

      <Divider {...withBottomSpacing} />

      {!props.expanded && (
        <Grid item textAlign={'center'}>
          <Button
            variant={'text'}
            startIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={() => props.onExpend?.(props.id)}
          >
            Afficher plus
          </Button>
        </Grid>
      )}

      {props.expanded && (
        <>
          {props.extraInfos?.map(({ key, value }) => <MandateCardEntry key={key} title={key} value={value} />)}

          <Divider {...withBottomSpacing} />

          <Grid item textAlign={'center'}>
            <Button
              variant={'text'}
              startIcon={<Iconify icon="eva:arrow-ios-upward-fill" />}
              onClick={() => props.onNarrow?.(props.id)}
            >
              Afficher moins
            </Button>
          </Grid>
        </>
      )}
    </Paper>
  )
}
