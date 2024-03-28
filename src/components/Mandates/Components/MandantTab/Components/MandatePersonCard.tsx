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
import styled from '@emotion/styled'
import { ReactNode, useEffect } from 'react'

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
  extraInfos?: KeyValueModel<string | ReactNode>[]
  onExpend?: (id: string) => void
  onNarrow?: (id: string) => void
  demandId?: string
  // Display button "Trouver un mandataire"
  type: MandatePersonCardType
  linkedPeople?: LightPersonModel[]
  maxProxyCount?: number
  onSelect?: () => void
  // Disable action buttons
  isProcessing?: boolean
  // Hide actions buttons "Trouver un mandataire", "Sélectionner" and so on.
  hideActions?: boolean
}

export enum MandatePersonCardType {
  FIND = 'find',
  MATCH_MANDANT = 'match_mandant',
  MATCH_PROXY = 'match_proxy',
  MATCHED_MANDANT = 'matched_mandant',
}

export default function MandatePersonCard(props: MandatePersonCardProps) {
  return (
    <Paper sx={{ mb: MuiSpacing.normal, p: MuiSpacing.normal, border: 1, borderColor: grey[200] }}>
      <Grid container alignItems="center" rowSpacing={MuiSpacing.normal} sx={{ mb: MuiSpacing.normal }}>
        <Grid item xs={6} md={8}>
          <PersonWithAvatar firstName={props.firstName} lastName={props.lastName} src={props.avatarUrl} id={props.id} />
        </Grid>

        {!props.hideActions && (
          <Grid item md={4} textAlign="right" sx={{ display: { xs: 'none', md: 'block' } }}>
            <ButtonGroup {...props} />
          </Grid>
        )}

        <Grid item xs={12}>
          {[
            MandatePersonCardType.MATCH_MANDANT,
            MandatePersonCardType.FIND,
            MandatePersonCardType.MATCHED_MANDANT,
          ].includes(props.type) && <MandateTag done={props.type === MandatePersonCardType.MATCHED_MANDANT} />}

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

        {!props.hideActions && (
          <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
            <ButtonGroup fullWidth {...props} />
          </Grid>
        )}
      </Grid>

      {typeof props.peopleInSameVotePlace === 'number' ? (
        <Grid container sx={{ mb: MuiSpacing.normal }}>
          <Grid item xs={12}>
            <MandatePeopleNumber count={props.peopleInSameVotePlace} />
          </Grid>
        </Grid>
      ) : null}

      {props.linkedPeople !== undefined && props.type === MandatePersonCardType.MATCH_PROXY && (
        <MandateCardEntry title={'Procurations'} value={`${props.linkedPeople?.length}/${props.maxProxyCount}`} />
      )}

      {props.linkedPeople && props.linkedPeople.length > 0 && (
        <Grid item sx={{ mb: MuiSpacing.large }}>
          <GroupContainer>
            <legend>
              <Typography color={'success.main'} fontSize={12}>
                {props.type === MandatePersonCardType.MATCHED_MANDANT ? 'Mandataire lié' : 'Mandants liés'}
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

      {!props.expended && props.onExpend && <ExpandButton onExpand={() => props.onExpend?.(props.id)} />}

      {props.expended && (
        <>
          {props.extraInfos?.map(({ key, value }) => <MandateCardEntry key={key} title={key} value={value} />)}

          {props.onNarrow && <NarrowButton onNarrow={() => props.onNarrow?.(props.id)} />}
        </>
      )}
    </Paper>
  )
}

const NarrowButton = ({ onNarrow }: { onNarrow?: () => void }) => (
  <>
    <Divider sx={withBottomSpacing} />

    <Grid item textAlign={'center'}>
      <Button
        variant={'text'}
        startIcon={<Iconify icon="eva:arrow-ios-upward-fill" />}
        onClick={onNarrow}
        data-testid="lessButton"
      >
        Afficher moins
      </Button>
    </Grid>
  </>
)

const ExpandButton = ({ onExpand }: { onExpand?: () => void }) => (
  <Grid item textAlign={'center'}>
    <Button
      variant={'text'}
      startIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
      onClick={onExpand}
      data-testid="moreButton"
    >
      Afficher plus
    </Button>
  </Grid>
)

const ButtonGroup = (props: { fullWidth?: boolean } & MandatePersonCardProps) => {
  switch (props.type) {
    case MandatePersonCardType.FIND:
      return (
        <Button onClick={props.onSelect} variant={'contained'} fullWidth={props.fullWidth}>
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

const MandateTag = ({ done }: { done?: boolean }) => (
  <UIChip
    label={done ? 'Mandant traité' : 'Mandant'}
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
