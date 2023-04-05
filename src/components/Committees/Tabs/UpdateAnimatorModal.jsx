import { Box } from '@mui/material'
import AdherentAutocomplete from 'components/Filters/Element/AdherentAutocomplete'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAnimator } from 'api/committees'
import { ModalForm } from 'ui/Dialog'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { useErrorHandler } from 'components/shared/error/hooks'

const UpdateAnimatorModal = ({ committeeId, animatorId, handleClose }) => {
  const [selectedAdherent, setSelectedAdherent] = useState(null)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()
  const queryClient = useQueryClient()
  const onSuccess = () => queryClient.invalidateQueries({ queryKey: 'committee-detail' })

  const { mutate, isLoading } = useMutation(updateAnimator, {
    onSuccess: () => {
      enqueueSnackbar(
        animatorId ? 'Le président du comité a été modifié' : 'Un président a été ajouté au comité',
        notifyVariants.success
      )
      onSuccess()
      handleClose()
    },
    onError: handleError,
  })

  const update = () => {
    mutate({ committeeId, animatorId: selectedAdherent?.uuid })
  }

  return (
    <ModalForm
      title={animatorId ? 'Modifier le président du comité' : 'Ajouter un président au comité'}
      handleClose={handleClose}
      createOrEdit={update}
      isLoading={isLoading}
      submitLabel={animatorId ? 'Modifier' : 'Ajouter'}
    >
      <Box>
        <Box sx={{ mt: 2 }}>
          <AdherentAutocomplete
            customStyle={{ bgcolor: 'colors.gray.50' }}
            value={selectedAdherent}
            onChange={setSelectedAdherent}
            initialParams={{ committee: committeeId, renaissance_membership: 'adherent_re' }}
          />
        </Box>
      </Box>
    </ModalForm>
  )
}

export default UpdateAnimatorModal

UpdateAnimatorModal.propTypes = {
  committeeId: PropTypes.string,
  animatorId: PropTypes.string,
  handleClose: PropTypes.func,
}
