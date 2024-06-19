import { useCallback, useState } from 'react'
import useProcurationProxyState from '~/api/Procuration/Hooks/useProcurationProxyState'
import useProcurationState from '~/api/Procuration/Hooks/useProcurationState'
import { ProcurationStatusEnum, SlotModel } from '~/api/Procuration/procuration.model'
import { Button, Grid } from '@mui/material'
import ConfirmationModal from '~/ui/Confirmation'
import {
  MandatePersonCardProps,
  MandatePersonCardType,
} from '~/components/Procurations/Components/MandantTab/Components/MandatePersonCard/MandatePersonCard'
import useProcurationRequestSlotState from '~/api/Procuration/Hooks/useProcurationRequestSlotState'
import useProcurationProxySlotState from '~/api/Procuration/Hooks/useProcurationProxySlotState'

export function MandatePersonCardStateManual({
  currentSlot,
  ...props
}: MandatePersonCardProps & { currentSlot: Omit<SlotModel, 'proxy'> }) {
  const [shouldConfirmManual, setShouldConfirmManual] = useState(false)
  const isProxy = [MandatePersonCardType.MATCH_PROXY, MandatePersonCardType.MATCHED_PROXY].includes(props.type)
  const { mutateAsync, isLoading } = isProxy ? useProcurationProxySlotState() : useProcurationRequestSlotState()

  const onManual = useCallback(() => {
    if (!currentSlot.uuid) {
      return
    }

    if (shouldConfirmManual) {
      mutateAsync({
        payload: {
          manual: !currentSlot.manual,
        },
        uuid: currentSlot.uuid,
      }).then(() => {
        setShouldConfirmManual(false)
      })
    } else {
      setShouldConfirmManual(true)
    }
  }, [mutateAsync, currentSlot.uuid, shouldConfirmManual, currentSlot.manual])
  const onCancelManual = useCallback(() => setShouldConfirmManual(false), [])

  const modalDescription = currentSlot.manual
    ? `Êtes-vous sûr de vouloir retirer le traitement manuel du ${currentSlot.round.name} de ${props.firstName} ?`
    : `Êtes-vous sûr de vouloir passer en traitement manuel le ${currentSlot.round.name} de ${props.firstName} ?`

  return (
    <>
      <Button
        variant={'soft'}
        fullWidth
        color={currentSlot.manual ? 'warning' : 'inherit'}
        disabled={isLoading || shouldConfirmManual}
        onClick={onManual}
      >
        {currentSlot.manual ? 'Retirer le traitement manuel' : 'Traité manuellement'}
      </Button>

      {shouldConfirmManual && (
        <ConfirmationModal
          title={'Traitement manuel'}
          description={modalDescription}
          onConfirm={onManual}
          onCancel={onCancelManual}
          isLoading={isLoading}
        />
      )}
    </>
  )
}

export function MandatePersonCardStateExclude(props: MandatePersonCardProps) {
  const [shouldConfirmExclude, setShouldConfirmExclude] = useState(false)
  const isProxy = [MandatePersonCardType.MATCH_PROXY, MandatePersonCardType.MATCHED_PROXY].includes(props.type)
  const { mutateAsync, isLoading } = isProxy ? useProcurationProxyState() : useProcurationState()

  const onExclude = useCallback(() => {
    if (!props.uuid) {
      return
    }

    if (shouldConfirmExclude) {
      mutateAsync({
        status: ProcurationStatusEnum.EXCLUDED,
        uuid: props.uuid,
      }).then(() => {
        setShouldConfirmExclude(false)
      })
    } else {
      setShouldConfirmExclude(true)
    }
  }, [mutateAsync, props.uuid, shouldConfirmExclude])
  const onCancelExclude = useCallback(() => setShouldConfirmExclude(false), [])

  return (
    <>
      <Grid item textAlign="right">
        <Button variant="soft" color="error" disabled={isLoading || shouldConfirmExclude} onClick={onExclude}>
          Exclure
        </Button>
      </Grid>

      {shouldConfirmExclude && (
        <ConfirmationModal
          title={'Exclusion'}
          description={`Êtes-vous sûr de vouloir exclure ${props.firstName} ?`}
          onConfirm={onExclude}
          onCancel={onCancelExclude}
          okButtonTitle={'Exclure'}
          isLoading={isLoading}
        />
      )}
    </>
  )
}
