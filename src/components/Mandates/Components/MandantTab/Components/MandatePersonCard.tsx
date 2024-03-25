import { Button, Grid, Paper } from '@mui/material'
import { MuiSpacing, withBottomSpacing } from '~/theme/spacing'
import PersonWithAvatar from '~/components/Mandates/Components/PersonWithAvatar/PersonWithAvatar'
import MandatePeopleNumber from '~/components/Mandates/Components/MandantTab/Components/MandatePeopleNumber'
import MandateCardEntry from '~/components/Mandates/Components/MandantTab/Components/MandateCardEntry'
import { KeyValueModel } from '~/models/common.model'
import Divider from '@mui/material/Divider'
import Iconify from '~/mui/iconify'
import { UIChip } from '~/ui/Card'
import { fontWeight } from '~/theme/typography'
import { activistTagShape } from '~/shared/activistTagShape'
import { grey, tagsColor } from '~/theme/palette'
import { LabelTypeModel } from '~/models/activist.model'

export interface MandatePersonCardProps {
  firstName: string
  lastName: string
  avatarUrl?: string
  tags: LabelTypeModel[]
  peopleInSameVotePlace: number
  votePlace: string
  location: string
  id: string
  expended?: boolean
  extraInfos?: KeyValueModel[]
  onExpend?: (id: string) => void
  onNarrow?: (id: string) => void
}

export default function MandatePersonCard(props: MandatePersonCardProps) {
  return (
    <Paper sx={{ mb: MuiSpacing.normal, p: MuiSpacing.normal, border: 1, borderColor: grey[200] }}>
      <Grid container alignItems="center" rowSpacing={MuiSpacing.normal} sx={{ mb: MuiSpacing.large }}>
        <Grid item xs={6} md={8}>
          <PersonWithAvatar firstName={props.firstName} lastName={props.lastName} src={props.avatarUrl} id={props.id} />
        </Grid>

        <Grid item xs={6} md={4} textAlign="right">
          <Button onClick={() => {}} variant={'contained'}>
            Trouver un mandataire
          </Button>
        </Grid>

        <Grid item xs={12}>
          {props.tags.map(tag => (
            <UIChip
              key={tag.label}
              label={tag.label}
              sx={{ mb: props.tags.length > 1 ? 1 : 0 }}
              labelStyle={{ fontSize: '14px', fontWeight: fontWeight.medium }}
              color={activistTagShape[tag.type]?.color ?? tagsColor.unknownText}
              variant={activistTagShape[tag.type]?.variant ?? 'contained'}
              bgcolor={activistTagShape[tag.type]?.bgColor ?? tagsColor.unknownBackground}
            />
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

      <Divider sx={withBottomSpacing} />

      {!props.expended && (
        <Grid item textAlign={'center'}>
          <Button
            variant={'text'}
            startIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={() => props.onExpend?.(props.id)}
            data-testid="moreButton"
          >
            Afficher plus
          </Button>
        </Grid>
      )}

      {props.expended && (
        <>
          {props.extraInfos?.map(({ key, value }) => <MandateCardEntry key={key} title={key} value={value} />)}

          <Divider sx={withBottomSpacing} />

          <Grid item textAlign={'center'}>
            <Button
              variant={'text'}
              startIcon={<Iconify icon="eva:arrow-ios-upward-fill" />}
              onClick={() => props.onNarrow?.(props.id)}
              data-testid="lessButton"
            >
              Afficher moins
            </Button>
          </Grid>
        </>
      )}
    </Paper>
  )
}
