import PropTypes from 'prop-types'
import { useState } from 'react'
import { Box } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { addCandidate } from 'api/committee_election'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import AdherentAutocomplete from 'components/Filters/Element/AdherentAutocomplete'
import { ModalForm } from 'ui/Dialog'
import UIInputLabel from 'ui/InputLabel/InputLabel'

const messages = {
  title: "Ajout d'un candidat à la liste",
  createSuccess: 'Le candidat a été ajouté avec succès',
  add: 'Ajouter',
  error: 'Vous devez sélectionner un adhérent',
}

const AddCandidateModal = ({ listId, candidates, handleClose, onAddSuccess }) => {
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()
  const { committeeId } = useParams()
  const [selectedAdherent, setSelectedAdherent] = useState(null)

  const { mutate, isLoading: isLoading } = useMutation({
    mutationFn: addCandidate,
    onSuccess: () => {
      if (typeof onAddSuccess === 'function') {
        onAddSuccess()
      }

      handleClose()
    },
    onError: error => {
      handleError(error)
      enqueueSnackbar(errorMessages[0].message, notifyVariants.error)
    },
  })

  const addNewCandidate = () => {
    if (!selectedAdherent) {
      enqueueSnackbar(messages.error, notifyVariants.error)
      return
    }

    if (candidates.find(candidate => candidate.committee_membership.adherent.uuid === selectedAdherent.uuid)) {
      enqueueSnackbar('Cet adhérent appartient déjà à une liste pour cette élection.', notifyVariants.error)
      return
    }

    mutate({ candidacies_group: listId, adherent: selectedAdherent.uuid })
  }

  return (
    <ModalForm
      title={messages.title}
      handleClose={handleClose}
      createOrEdit={addNewCandidate}
      isLoading={isLoading}
      submitLabel={messages.add}
    >
      <Box>
        <UIInputLabel required>Renseigner le candidat</UIInputLabel>
        <AdherentAutocomplete
          customStyle={{ bgcolor: 'colors.gray.50', mt: 2 }}
          value={selectedAdherent}
          onChange={setSelectedAdherent}
          initialParams={{ committee: committeeId }}
        />
      </Box>
    </ModalForm>
  )
}

export default AddCandidateModal

AddCandidateModal.propTypes = {
  listId: PropTypes.string,
  candidates: PropTypes.array,
  onAddSuccess: PropTypes.func,
  handleClose: PropTypes.func,
}
