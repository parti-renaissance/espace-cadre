import { Button } from '@mui/material'
import {
  MandatePersonCardProps,
  MandatePersonCardType,
} from '~/components/Procurations/Components/MandantTab/Components/MandatePersonCard/MandatePersonCard'

export default function MandatePersonCardButtonGroup(
  props: { fullWidth?: boolean; extraText?: string; disabled?: boolean } & Omit<MandatePersonCardProps, 'onSelect'> & {
      onSelect: () => void
    }
) {
  switch (props.type) {
    case MandatePersonCardType.FIND:
      return (
        <Button onClick={props.onSelect} variant={'contained'} fullWidth={props.fullWidth} disabled={props.disabled}>
          Trouver un mandataire {props.extraText}
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
          Sélectionner {props.extraText}
        </Button>
      )
    case MandatePersonCardType.MATCH_MANDANT:
    default:
      return <></>
  }
}
