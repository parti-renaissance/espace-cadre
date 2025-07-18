import styled from '@emotion/styled'
import { Button, Grid, Paper, Typography } from '@mui/material'
import Divider from '@mui/material/Divider'
import { Fragment, ReactNode } from 'react'
import MandateCardEntry from '~/components/Procurations/Components/MandantTab/Components/MandateCardEntry'
import PersonWithAvatar from '~/components/Procurations/Components/PersonWithAvatar/PersonWithAvatar'
import pluralize from '~/components/shared/pluralize/pluralize'
import { LabelTypeModel } from '~/models/activist.model'
import { KeyValueModel } from '~/models/common.model'
import Iconify from '~/mui/iconify'
import { grey, success } from '~/theme/palette'
import { MuiSpacing, withBottomSpacing } from '~/theme/spacing'
import { fontWeight } from '~/theme/typography'
import { UIChip } from '~/ui/Card'
import {
  MandatePersonCardStateManual,
  MandatePersonCardStateExclude,
} from '~/components/Procurations/Components/MandantTab/Components/MandatePersonCard/Components/MandatePersonCardStateActions'
import MandatePersonCardButtonGroup from '~/components/Procurations/Components/MandantTab/Components/MandatePersonCard/Components/MandatePersonCardButtonGroup'
import {
  ActionModel,
  PROCURATION_STATUS_LABELS,
  ProcurationStatusEnum,
  RoundModel,
  SlotModel,
  VoteZoneModel,
} from '~/api/Procuration/procuration.model'
import { getHumanFormattedDate, getHumanFormattedTime } from '~/utils/date'
import { isPast } from 'date-fns'
import TagsList from '~/components/Activists/Member/TagsList'

export interface MandatePersonCardProps {
  firstName: string
  lastName: string
  status: string
  avatarUrl?: string
  tags: LabelTypeModel[]
  peopleInSameVotePlace?: number
  votePlace: string
  district: null | VoteZoneModel
  location: string
  acceptVoteNearby: boolean
  uuid?: string
  id: string
  expended?: boolean
  extraInfos?: KeyValueModel<string | ReactNode>[]
  onExpend?: (id: string) => void
  onNarrow?: (id: string) => void
  roundId?: string
  // Display button "Trouver un mandataire"
  type: MandatePersonCardType
  linkedPeople?: Array<SlotModel>
  maxProxyCount?: number
  onSelect?: (roundId?: string) => void
  // Disable action buttons
  isProcessing?: boolean
  // Hide actions buttons "Trouver un mandataire", "Sélectionner" and so on.
  hideActions?: boolean
  hideStateActions?: boolean
  onPersonView?: (id: string, roundId: string) => void
  // Will deposit mandate in France
  inFrenchSoil?: boolean
  history: ActionModel[] | null
}

export enum MandatePersonCardType {
  FIND = 'find',
  MATCH_MANDANT = 'match_mandant',
  MATCH_PROXY = 'match_proxy',
  MATCHED_PROXY = 'matched_proxy',
  MATCHED_MANDANT = 'matched_mandant',
}

export default function MandatePersonCard(props: MandatePersonCardProps) {
  const isRoundPast = (x: RoundModel) => isPast(new Date(x.date))

  const pastStyle = (x: RoundModel) => (isRoundPast(x) ? { display: 'none' } : {})
  const linkedPeople = props.linkedPeople
    ? props.linkedPeople.map(x => ({ ...x, proxy: (x.proxy ?? x.request) ? [x.proxy ?? x.request] : [] }))
    : undefined

  return (
    <Paper sx={{ mb: MuiSpacing.normal, p: MuiSpacing.normal, border: 1, borderColor: grey[200] }}>
      <Grid container alignItems="center" rowSpacing={MuiSpacing.normal} sx={{ mb: MuiSpacing.normal }}>
        <Grid item xs={6} md={8} lg={6}>
          <PersonWithAvatar firstName={props.firstName} lastName={props.lastName} src={props.avatarUrl} id={props.id} />
        </Grid>
        <Grid item xs={6} md={8} lg={6}>
          {!props.hideStateActions && <MandatePersonCardStateExclude {...props} />}
        </Grid>

        <Grid item container gap={0.5} xs={12}>
          {[
            MandatePersonCardType.MATCH_MANDANT,
            MandatePersonCardType.FIND,
            MandatePersonCardType.MATCHED_MANDANT,
          ].includes(props.type) &&
            ((props.status !== ProcurationStatusEnum.PENDING && (
              <>
                <MandateTag status={'Mandant'} />
                <MandateTag status={props.status} />
              </>
            )) || <MandateTag status={'Mandant'} />)}

          {[MandatePersonCardType.MATCH_PROXY, MandatePersonCardType.MATCHED_PROXY].includes(props.type) &&
            ((props.status !== ProcurationStatusEnum.PENDING && (
              <>
                <ProxyTag status={'Mandataire'} />
                <ProxyTag status={props.status} />
              </>
            )) || <ProxyTag status={'Mandataire'} />)}

          <TagsList tags={props.tags} />
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mt: MuiSpacing.normal }} />
        </Grid>

        {linkedPeople?.map(x => (
          <Fragment key={x.uuid + props.id}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: MuiSpacing.normal, mb: MuiSpacing.normal }}>
                {x.round.name} {isRoundPast(x.round) && '(🚫 Passé)'}
              </Typography>
            </Grid>

            <Grid container justifyItems="center">
              {([MandatePersonCardType.FIND].includes(props.type) || props.roundId === x.round.uuid) &&
                x.proxy.length < 1 && (
                  <Grid item xs={8} pr={MuiSpacing.normal} sx={{ my: 2, ...pastStyle(x.round) }}>
                    <MandatePersonCardButtonGroup
                      fullWidth
                      {...props}
                      disabled={x.manual}
                      onSelect={() => props.onSelect?.(x.round.uuid)}
                      extraText={x.round.name}
                    />
                  </Grid>
                )}
              {[MandatePersonCardType.FIND].includes(props.type) && x.proxy.length < 1 && (
                <Grid item xs={4} sx={{ my: 2, ...pastStyle(x.round) }}>
                  <MandatePersonCardStateManual {...props} currentSlot={x} />
                </Grid>
              )}
            </Grid>
            {(([MandatePersonCardType.MATCHED_MANDANT, MandatePersonCardType.MATCHED_PROXY].includes(props.type) &&
              x.manual) ||
              ([MandatePersonCardType.MATCH_PROXY].includes(props.type) && !props.roundId && !x.proxy?.length)) && (
              <Grid item xs={12} sx={{ mb: 2, ...pastStyle(x.round) }}>
                <MandatePersonCardStateManual {...props} currentSlot={x} />
              </Grid>
            )}

            {x.proxy !== undefined &&
              [MandatePersonCardType.MATCH_PROXY, MandatePersonCardType.MATCHED_PROXY].includes(props.type) && (
                <MandateCardEntry
                  title={pluralize(x.proxy.length, 'Procuration')}
                  value={`${x.proxy.length}/${props.maxProxyCount}`}
                />
              )}

            {x.proxy && x.proxy.length > 0 && (
              <Grid item xs={12}>
                <GroupContainer>
                  <legend>
                    <Typography color={'success.main'} fontSize={12}>
                      {props.type === MandatePersonCardType.MATCHED_MANDANT
                        ? 'Mandataire lié'
                        : `${pluralize(x.proxy.length, 'Mandant')} ${pluralize(x.proxy.length, 'lié')}`}
                    </Typography>
                  </legend>

                  {x.proxy.map(el =>
                    el ? (
                      <Grid sx={{ mb: MuiSpacing.small }} key={el.uuid + 'proxy'}>
                        <PersonWithAvatar
                          firstName={el.first_names}
                          lastName={el.last_name}
                          src={props.avatarUrl}
                          id={props.id}
                          onPersonView={() =>
                            props.onPersonView?.(
                              MandatePersonCardType.MATCH_MANDANT === props.type ? props.uuid! : el.uuid,
                              x.round.uuid
                            )
                          }
                        />
                      </Grid>
                    ) : null
                  )}
                </GroupContainer>
              </Grid>
            )}
            <Grid item xs={12}>
              <HistoDetail data={x.actions} />
              <Divider sx={{ mt: MuiSpacing.normal, backgroundColor: 'black' }} />
            </Grid>
          </Fragment>
        ))}
      </Grid>

      <MandateCardEntry title={'Bureau de vote'} value={props.votePlace} />
      {props.district && <MandateCardEntry title={'Circonscription'} value={props.district.name} />}
      <MandateCardEntry title={'Commune, pays...'} value={props.location} />
      <MandateCardEntry title={'Accepte voter dans une autre circo.'} value={props.acceptVoteNearby ? 'Oui' : 'Non'} />

      {props.inFrenchSoil && <MandateCardEntry title={'Lieu de dépôt'} value={'Procuration en France'} />}

      {props.extraInfos && <Divider sx={withBottomSpacing} />}

      {!props.expended && props.onExpend && <ExpandButton onExpand={() => props.onExpend?.(props.id)} />}

      {props.expended && (
        <>
          {props.extraInfos?.map(({ key, value }) => (
            <MandateCardEntry key={key} title={key} value={value} />
          ))}

          {props.onNarrow && <Divider sx={withBottomSpacing} />}

          {props.history && <HistoDetail data={props.history} />}

          {props.history && props.history.length > 0 && <Divider sx={withBottomSpacing} />}

          {props.onNarrow && <NarrowButton onNarrow={() => props.onNarrow?.(props.id)} />}
        </>
      )}
    </Paper>
  )
}

const HistoDetail = ({ data }: { data: SlotModel['actions'] }) => {
  const mapStatusReadable = (
    status: NonNullable<SlotModel['actions']>[0]['status'],
    ctx: NonNullable<SlotModel['actions']>[0]['context']
  ) => {
    switch (status) {
      case 'match':
        return 'Lié'
      case 'unmatch':
        return 'Délié'
      case 'status_update':
        if (ctx.new_status === 'pending') {
          return 'Passé en attente'
        }
        if (ctx.new_status === 'excluded') {
          return 'Exclu'
        }

        if (ctx.new_status === 'manual') {
          return 'Traité manuellement'
        }
        return 'Statut mis à jour'
      default:
        return status
    }
  }

  return data && data.length > 0 ? (
    <Grid item xs={12} pb={2}>
      <Typography variant="body2" color="textSecondary">
        Historique
      </Typography>
      {data.map(({ status, date, author, author_scope, context }) => (
        <Grid key={date} item xs={12} sx={{ paddingX: 2 }}>
          <Divider sx={{ mt: MuiSpacing.normal }} />
          <Typography variant="body2" color="textSecondary">
            {mapStatusReadable(status, context)} le {getHumanFormattedDate(date)} à {getHumanFormattedTime(date)}
            {author ? ` par ${author?.first_name} ${author?.last_name}` : ''}
            {author_scope ? ` (${author_scope})` : ''}
          </Typography>
          {/* <Divider sx={withBottomSpacing} /> */}
        </Grid>
      ))}
    </Grid>
  ) : null
}

const NarrowButton = ({ onNarrow, text }: { onNarrow?: () => void; text?: string }) => (
  <Grid item textAlign={'center'}>
    <Button
      variant={'text'}
      startIcon={<Iconify icon="eva:arrow-ios-upward-fill" />}
      onClick={onNarrow}
      data-testid="lessButton"
    >
      {text ?? 'Afficher moins'}
    </Button>
  </Grid>
)

const ExpandButton = ({ onExpand, text }: { onExpand?: () => void; text?: string }) => (
  <Grid item textAlign={'center'}>
    <Button
      variant={'text'}
      startIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
      onClick={onExpand}
      data-testid="moreButton"
    >
      {text ?? 'Afficher plus'}
    </Button>
  </Grid>
)

const mapColor = (status: string, defaultColor: string) => {
  switch (status) {
    case 'excluded':
      return 'red'
    case 'completed':
      return 'green'
    default:
      return defaultColor
  }
}

const MandateTag = ({ status }: { status: string }) => (
  <UIChip
    label={PROCURATION_STATUS_LABELS[status] ?? status}
    labelStyle={{ fontSize: '14px', fontWeight: fontWeight.medium }}
    color={'white'}
    variant={'contained'}
    bgcolor={mapColor(status, '#00B8D9')}
  />
)

const ProxyTag = ({ status }: { status: string }) => (
  <UIChip
    label={PROCURATION_STATUS_LABELS[status] ?? status}
    labelStyle={{ fontSize: '14px', fontWeight: fontWeight.medium }}
    color={'white'}
    variant={'contained'}
    bgcolor={mapColor(status, '#FF8438')}
  />
)

const GroupContainer = styled.fieldset({
  border: '1px dashed',
  borderColor: success.main,
  borderRadius: 8,
  marginBottom: 15,
})
