import { Button } from '@mui/material'
import {
  MandatePersonCardProps,
  MandatePersonCardType,
} from '~/components/Procurations/Components/MandantTab/Components/MandatePersonCard/MandatePersonCard'

export default function MandatePersonCardButtonGroup(props: { fullWidth?: boolean } & MandatePersonCardProps) {
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
