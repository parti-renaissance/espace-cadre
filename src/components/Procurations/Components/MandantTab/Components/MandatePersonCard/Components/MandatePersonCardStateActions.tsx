import { useCallback, useState } from 'react'
import useProcurationProxyState from '~/api/Procuration/Hooks/useProcurationProxyState'
import useProcurationState from '~/api/Procuration/Hooks/useProcurationState'
import { ProcurationStatusEnum } from '~/api/Procuration/procuration.model'
import { Button, Grid } from '@mui/material'
import { MuiSpacing } from '~/theme/spacing'
import ConfirmationModal from '~/ui/Confirmation'
import {
  MandatePersonCardProps,
  MandatePersonCardType,
} from '~/components/Procurations/Components/MandantTab/Components/MandatePersonCard/MandatePersonCard'

export default function MandatePersonCardStateActions(props: MandatePersonCardProps) {
  const [shouldConfirmExclude, setShouldConfirmExclude] = useState(false)
  const [shouldConfirmManual, setShouldConfirmManual] = useState(false)

  const isProxy = [MandatePersonCardType.MATCH_PROXY, MandatePersonCardType.MATCHED_PROXY].includes(props.type)
  const { mutateAsync, isLoading } = isProxy ? useProcurationProxyState() : useProcurationState()

  const onManual = useCallback(() => {
    if (!props.uuid) {
      return
    }

    if (shouldConfirmManual) {
      mutateAsync({
        status: ProcurationStatusEnum.MANUAL,
        uuid: props.uuid,
      })
    } else {
      setShouldConfirmManual(true)
    }
  }, [mutateAsync, props.uuid, shouldConfirmManual])
  const onCancelManual = useCallback(() => setShouldConfirmManual(false), [])

  const onExclude = useCallback(() => {
    if (!props.uuid) {
      return
    }

    if (shouldConfirmExclude) {
      mutateAsync({
        status: ProcurationStatusEnum.EXCLUDED,
        uuid: props.uuid,
      })
    } else {
      setShouldConfirmExclude(true)
    }
  }, [mutateAsync, props.uuid, shouldConfirmExclude])
  const onCancelExclude = useCallback(() => setShouldConfirmExclude(false), [])

  return (
    <>
      <Grid item container mb={MuiSpacing.normal}>
        {!isProxy && (
          <Grid item xs={6}>
            <Button variant="soft" color="inherit" disabled={isLoading || shouldConfirmManual} onClick={onManual}>
              Traité manuellement
            </Button>
          </Grid>
        )}
        <Grid item xs={isProxy ? 12 : 6} textAlign="right">
          <Button variant="soft" color="error" disabled={isLoading || shouldConfirmExclude} onClick={onExclude}>
            Exclure
          </Button>
        </Grid>
      </Grid>

      {shouldConfirmExclude && (
        <ConfirmationModal
          title={'Exclusion'}
          description={`Êtes-vous sûr de vouloir exclure ${props.firstName} ?`}
          onConfirm={onExclude}
          onCancel={onCancelExclude}
          okButtonTitle={'Exclure'}
        />
      )}

      {shouldConfirmManual && (
        <ConfirmationModal
          title={'Traitement manuel'}
          description={`Êtes-vous sûr de vouloir passer en "traité manuellement" ${props.firstName} ?`}
          onConfirm={onManual}
          onCancel={onCancelManual}
        />
      )}
    </>
  )
}
