import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Grid, Typography, IconButton } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import TextField from 'ui/TextField'
import { styled } from '@mui/system'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import UIFormMessage from 'ui/FormMessage/FormMessage'
import Loader from 'ui/Loader'
import { createGroupQuery, updateGroupQuery } from 'api/groups'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useUserScope } from '../../redux/user/hooks'
import UISelect from 'ui/Select/Select'
import Button from 'ui/Button'
import { useCurrentDeviceType } from 'components/shared/device/hooks'
import Dialog from 'ui/Dialog'
import { nationalScopes } from 'shared/scopes'

const Form = styled('form')`
  display: flex;
  flex-direction: column;
`

const Title = styled(Typography)`
  font-size: 24px;
  line-height: 24px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.gray800};
`

const CharactersLimit = styled(Typography)`
  font-size: 10px;
  color: ${({ theme }) => theme.palette.gray300};
`

const messages = {
  create: 'Créer un groupe',
  edit: 'Modifier un groupe',
  addMembers: 'Ajouter des militants',
  add: 'Ajouter',
  groupMember: 'Militants du groupe',
  noMember: 'Ce groupe ne contient aucun membre',
  charactersLimit: '(255 charactères)',
  submit: 'Valider',
  createSuccess: 'Groupe créé avec succès',
  editSuccess: 'Le groupe a bien été modifié',
}

const groupSchema = Yup.object({
  name: Yup.string().min(1, 'Minimum 1 charactère').max(255, 'Maximum 255 charactères').required('Titre obligatoire'),
})

const GroupModal = ({ open, group, onCloseResolve, onCreateEditResolve }) => {
  const { handleError, errorMessages, resetErrorMessages } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()
  const [currentScope] = useUserScope()
  const isNational = useMemo(() => nationalScopes.includes(currentScope.code), [currentScope.code])
  const { isMobile } = useCurrentDeviceType()
  const { mutateAsync: createOrUpdateGroup, isLoading } = useMutation(
    !group?.id ? createGroupQuery : updateGroupQuery,
    {
      onSuccess: async (_, updatedGroup) => {
        await onCreateEditResolve(updatedGroup)
        enqueueSnackbar(!group?.id ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
      },
      onError: handleError,
    }
  )

  const handleClose = () => {
    onCloseResolve()
    resetErrorMessages()
  }

  const formik = useFormik({
    initialValues: {
      name: group?.name,
      zone: isNational ? null : group?.zone?.id || currentScope.zones[0].uuid,
    },
    validationSchema: groupSchema,
    enableReinitialize: true,
    onSubmit: async values => {
      await createOrUpdateGroup(group.withName(values.name).withZone(values.zone))
      handleClose()
    },
  })

  return (
    <Dialog open={open} handleClose={handleClose} data-testid="create-edit-modal">
      <Form>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2, ...(isMobile && { pt: 2 }) }}>
          <Title component="span">{group?.id ? messages.edit : messages.create}</Title>
          <IconButton onClick={handleClose}>
            <CloseRoundedIcon />
          </IconButton>
        </Grid>
        <Grid container sx={{ mb: 1 }}>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600 }}>Nom</Typography>&nbsp;
            <CharactersLimit>{messages.charactersLimit}</CharactersLimit>
          </Grid>
          <Grid item xs={12}>
            <TextField formik={formik} label="name" data-cy="group-title-input" />
          </Grid>
          {errorMessages.map(({ message, index }) => (
            <Grid item xs={12} key={index}>
              <UIFormMessage severity="error">{message}</UIFormMessage>
            </Grid>
          ))}
        </Grid>
        {!isNational && (
          <UISelect
            options={currentScope.zones.map(z => ({ key: z.uuid, value: `${z.name} - ${z.code}` }))}
            onChange={v => {
              formik.setFieldValue('zone', v)
            }}
            value={formik.values.zone}
            disabled={currentScope.zones.length === 1}
            data-cy="group-area-select"
          />
        )}

        <Grid container sx={{ mt: 2 }}>
          <Button
            type="submit"
            onClick={formik.handleSubmit}
            disabled={isLoading}
            rootProps={{
              sx: {
                color: 'whiteCorner',
                width: '100%',
              },
            }}
          >
            {isLoading ? <Loader size={12} color="white" /> : messages.submit}
          </Button>
        </Grid>
      </Form>
    </Dialog>
  )
}

export default GroupModal

GroupModal.defaultProps = {
  group: null,
}

GroupModal.propTypes = {
  open: PropTypes.bool.isRequired,
  group: PropTypes.object,
  onCloseResolve: PropTypes.func.isRequired,
  onCreateEditResolve: PropTypes.func.isRequired,
}
