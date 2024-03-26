import { Button, Grid, Paper, Typography } from '@mui/material'
import { MuiSpacing, withBottomSpacing } from '~/theme/spacing'
import PersonWithAvatar from '~/components/Mandates/Components/PersonWithAvatar/PersonWithAvatar'
import MandatePeopleNumber from '~/components/Mandates/Components/MandantTab/Components/MandatePeopleNumber'
import MandateCardEntry from '~/components/Mandates/Components/MandantTab/Components/MandateCardEntry'
import { KeyValueModel, LightPersonModel } from '~/models/common.model'
import Divider from '@mui/material/Divider'
import Iconify from '~/mui/iconify'
import { UIChip } from '~/ui/Card'
import { fontWeight } from '~/theme/typography'
import { activistTagShape } from '~/shared/activistTagShape'
import { grey, success, tagsColor } from '~/theme/palette'
import { LabelTypeModel } from '~/models/activist.model'
import { useNavigate } from 'react-router-dom'
import paths from '~/shared/paths'
import styled from '@emotion/styled'

export interface MandatePersonCardProps {
  firstName: string
  lastName: string
  avatarUrl?: string
  tags: LabelTypeModel[]
  peopleInSameVotePlace?: number
  votePlace: string
  location: string
  id: string
  expended?: boolean
  extraInfos?: KeyValueModel[]
  onExpend?: (id: string) => void
  onNarrow?: (id: string) => void
  demandId?: string
  // Display button "Trouver un mandataire"
  type: MandatePersonCardType
  linkedPeople?: LightPersonModel[]
  maxProxyCount?: number
  onSelect?: () => void
  isProcessing?: boolean
}

export enum MandatePersonCardType {
  FIND = 'find',
  MATCH_MANDANT = 'match_mandant',
  MATCH_PROXY = 'match_proxy',
}

export default function MandatePersonCard(props: MandatePersonCardProps) {
  return (
    <Paper sx={{ mb: MuiSpacing.normal, p: MuiSpacing.normal, border: 1, borderColor: grey[200] }}>
      <Grid container alignItems="center" rowSpacing={MuiSpacing.normal} sx={{ mb: MuiSpacing.large }}>
        <Grid item xs={6} md={8}>
          <PersonWithAvatar firstName={props.firstName} lastName={props.lastName} src={props.avatarUrl} id={props.id} />
        </Grid>

        <Grid item md={4} textAlign="right" sx={{ display: { xs: 'none', md: 'block' } }}>
          <ButtonGroup {...props} />
        </Grid>

        <Grid item xs={12}>
          {props.type === MandatePersonCardType.MATCH_MANDANT && <MandateTag />}

          {props.type === MandatePersonCardType.MATCH_PROXY && <ProxyTag />}

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

        <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
          <ButtonGroup fullWidth {...props} />
        </Grid>
      </Grid>

      {props.peopleInSameVotePlace && (
        <Grid container sx={{ mb: MuiSpacing.large }}>
          <Grid item xs={12}>
            <MandatePeopleNumber count={props.peopleInSameVotePlace} />
          </Grid>
        </Grid>
      )}

      {props.linkedPeople !== undefined && (
        <MandateCardEntry title={'Procurations'} value={`${props.linkedPeople?.length}/${props.maxProxyCount}`} />
      )}

      {props.linkedPeople && (
        <Grid item sx={{ mb: MuiSpacing.large }}>
          <GroupContainer>
            <legend>
              <Typography color={'success.main'} fontSize={12}>
                Mandants liés
              </Typography>
            </legend>

            {props.linkedPeople.map(el => (
              <Grid sx={{ mb: MuiSpacing.small }} key={el.id}>
                <PersonWithAvatar firstName={el.firstName} lastName={el.lastName} src={props.avatarUrl} id={props.id} />
              </Grid>
            ))}
          </GroupContainer>
        </Grid>
      )}

      <MandateCardEntry title={'Bureau de vote'} value={props.votePlace} />
      <MandateCardEntry title={'Commune, pays...'} value={props.location} />

      {props.extraInfos && <Divider sx={withBottomSpacing} />}

      {!props.expended && props.onExpend && (
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

          {props.onNarrow && (
            <>
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
        </>
      )}
    </Paper>
  )
}

const ButtonGroup = (props: { fullWidth?: boolean } & MandatePersonCardProps) => {
  const navigate = useNavigate()

  switch (props.type) {
    case MandatePersonCardType.FIND:
      return (
        <Button
          onClick={() => {
            navigate(`${paths.procurations}/request/${props.demandId}`)
          }}
          variant={'contained'}
          fullWidth={props.fullWidth}
        >
          Trouver un mandataire
        </Button>
      )
    case MandatePersonCardType.MATCH_PROXY:
      return (
        <Button
          onClick={props.onSelect}
          variant={'contained'}
          fullWidth={props.fullWidth}
          disabled={props.isProcessing}
        >
          Sélectionner
        </Button>
      )
    case MandatePersonCardType.MATCH_MANDANT:
    default:
      return <></>
  }
}

const MandateTag = () => (
  <UIChip
    label={'Mandant'}
    labelStyle={{ fontSize: '14px', fontWeight: fontWeight.medium }}
    color={'white'}
    variant={'contained'}
    bgcolor={'#00B8D9'}
  />
)

const ProxyTag = () => (
  <UIChip
    label={'Mandataire'}
    labelStyle={{ fontSize: '14px', fontWeight: fontWeight.medium }}
    color={'white'}
    variant={'contained'}
    bgcolor={'#FF8438'}
  />
)

const GroupContainer = styled.fieldset({
  border: '1px dashed',
  borderColor: success.main,
  borderRadius: 8,
  marginBottom: 15,
})
