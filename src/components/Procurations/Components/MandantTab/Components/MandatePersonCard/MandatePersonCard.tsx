import styled from '@emotion/styled'
import { Button, Grid, Paper, Typography } from '@mui/material'
import Divider from '@mui/material/Divider'
import { ReactNode } from 'react'
import MandateCardEntry from '~/components/Procurations/Components/MandantTab/Components/MandateCardEntry'
import PersonWithAvatar from '~/components/Procurations/Components/PersonWithAvatar/PersonWithAvatar'
import pluralize from '~/components/shared/pluralize/pluralize'
import { LabelTypeModel } from '~/models/activist.model'
import { KeyValueModel } from '~/models/common.model'
import Iconify from '~/mui/iconify'
import { activistTagShape } from '~/shared/activistTagShape'
import { grey, success, tagsColor } from '~/theme/palette'
import { MuiSpacing, withBottomSpacing } from '~/theme/spacing'
import { fontWeight } from '~/theme/typography'
import { UIChip } from '~/ui/Card'
import MandatePersonCardStateActions from '~/components/Procurations/Components/MandantTab/Components/MandatePersonCard/Components/MandatePersonCardStateActions'
import MandatePersonCardButtonGroup from '~/components/Procurations/Components/MandantTab/Components/MandatePersonCard/Components/MandatePersonCardButtonGroup'
import { SlotModel } from '~/api/Procuration/procuration.model'
import { getFormattedDate } from '~/utils/date'

export interface MandatePersonCardProps {
  firstName: string
  lastName: string
  avatarUrl?: string
  tags: LabelTypeModel[]
  peopleInSameVotePlace?: number
  votePlace: string
  location: string
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
}

export enum MandatePersonCardType {
  FIND = 'find',
  MATCH_MANDANT = 'match_mandant',
  MATCH_PROXY = 'match_proxy',
  MATCHED_PROXY = 'matched_proxy',
  MATCHED_MANDANT = 'matched_mandant',
}

export default function MandatePersonCard(props: MandatePersonCardProps) {
  const linkedPeople = props.linkedPeople
    ? props.linkedPeople.map(x => ({ ...x, proxy: x.proxy ?? x.request ? [x.proxy ?? x.request] : [] }))
    : undefined

  return (
    <Paper sx={{ mb: MuiSpacing.normal, p: MuiSpacing.normal, border: 1, borderColor: grey[200] }}>
      <Grid container alignItems="center" rowSpacing={MuiSpacing.normal} sx={{ mb: MuiSpacing.normal }}>
        <Grid item xs={6} md={8} lg={6}>
          <PersonWithAvatar firstName={props.firstName} lastName={props.lastName} src={props.avatarUrl} id={props.id} />
        </Grid>

        <Grid item container gap={0.5} xs={12}>
          {[
            MandatePersonCardType.MATCH_MANDANT,
            MandatePersonCardType.FIND,
            MandatePersonCardType.MATCHED_MANDANT,
          ].includes(props.type) && <MandateTag done={props.type === MandatePersonCardType.MATCHED_MANDANT} />}

          {[MandatePersonCardType.MATCH_PROXY, MandatePersonCardType.MATCHED_PROXY].includes(props.type) && (
            <ProxyTag done={props.type === MandatePersonCardType.MATCHED_PROXY} />
          )}

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
        <Grid item xs={12}>
          <Divider sx={{ mt: MuiSpacing.normal }} />
        </Grid>

        {linkedPeople?.map(x => (
          <>
            <Grid key={x.uuid} item xs={12}>
              <Typography variant="h6" sx={{ mt: MuiSpacing.normal }}>
                {x.round.name}
              </Typography>
            </Grid>

            {props.type === MandatePersonCardType.FIND || props.roundId === x.round.uuid ? (
              <Grid key={x.uuid} item xs={12} pb={2}>
                {x.proxy.length < 1 && (
                  <>
                    <MandatePersonCardButtonGroup
                      fullWidth
                      {...props}
                      onSelect={() => props.onSelect?.(x.round.uuid)}
                      extraText={x.round.name}
                    />
                    <Divider sx={{ mt: MuiSpacing.normal }} />
                  </>
                )}
              </Grid>
            ) : null}

            {x.proxy !== undefined &&
              [MandatePersonCardType.MATCH_PROXY, MandatePersonCardType.MATCHED_PROXY].includes(props.type) && (
                <MandateCardEntry
                  title={pluralize(x.proxy.length, 'Procuration')}
                  value={`${x.proxy.length}/${props.maxProxyCount}`}
                />
              )}

            {x.proxy && x.proxy.length > 0 && (
              <Grid item sx={{ mb: MuiSpacing.large }}>
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
                      <Grid sx={{ mb: MuiSpacing.small }} key={el.uuid}>
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
                        {/*@ts-expect-error fefwf */}
                        {el.matched_at && (
                          <Grid item mt={MuiSpacing.small}>
                            <Typography fontSize={14} color={'text.secondary'}>
                              {/*@ts-expect-error fefwf */}
                              Lié le {getFormattedDate(el.matched_at)} par {el.matcher?.first_name}{' '}
                              {/*@ts-expect-error fefwf */}
                              {el.matcher?.last_name}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    ) : null
                  )}
                </GroupContainer>
              </Grid>
            )}
            <Grid item xs={12}>
              <Divider sx={{ mt: MuiSpacing.normal }} />
            </Grid>
          </>
        ))}
      </Grid>

      {/* {typeof props.peopleInSameVotePlace === 'number' ? (
        <Grid container sx={{ mb: MuiSpacing.normal }}>
          <Grid item xs={12}>
            <MandatePeopleNumber count={props.peopleInSameVotePlace} />
          </Grid>
        </Grid>
      ) : null} */}

      <MandateCardEntry title={'Bureau de vote'} value={props.votePlace} />
      <MandateCardEntry title={'Commune, pays...'} value={props.location} />

      {props.inFrenchSoil && <MandateCardEntry title={'Lieu de dépôt'} value={'Procuration en France'} />}

      {props.extraInfos && <Divider sx={withBottomSpacing} />}

      {!props.expended && props.onExpend && <ExpandButton onExpand={() => props.onExpend?.(props.id)} />}

      {props.expended && (
        <>
          {props.extraInfos?.map(({ key, value }) => <MandateCardEntry key={key} title={key} value={value} />)}

          {props.onNarrow && <Divider sx={withBottomSpacing} />}

          {!props.hideStateActions && <MandatePersonCardStateActions {...props} />}

          {props.onNarrow && <NarrowButton onNarrow={() => props.onNarrow?.(props.id)} />}
        </>
      )}
    </Paper>
  )
}

const NarrowButton = ({ onNarrow }: { onNarrow?: () => void }) => (
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

const MandateTag = ({ done }: { done?: boolean }) => (
  <UIChip
    label={done ? 'Mandant traité' : 'Mandant'}
    labelStyle={{ fontSize: '14px', fontWeight: fontWeight.medium }}
    color={'white'}
    variant={'contained'}
    bgcolor={'#00B8D9'}
  />
)

const ProxyTag = ({ done }: { done?: boolean }) => (
  <UIChip
    label={done ? 'Mandataire traité' : 'Mandataire'}
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
