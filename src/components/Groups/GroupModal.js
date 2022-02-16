import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useMutation } from 'react-query'
import { Dialog, Paper, Grid, Button as MuiButton, Typography, IconButton } from '@mui/material'
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

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(4)};
  width: 664px;
  border-radius: 12px;
`
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

const CharactersLimit = styled(Typography)(
  ({ theme }) => `
  font-size: 10px;
  color: ${theme.palette.gray300}
`
)

const Button = styled(MuiButton)(({ theme }) => ({
  color: theme.palette.campaign.button.color.main,
  background: theme.palette.campaign.button.background.main,
  border: 'none',
  borderRadius: '8px',
  '&:hover': {
    color: theme.palette.campaign.button.color.main,
    background: theme.palette.campaign.button.background.main,
  },
  height: '35px',
}))

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
const nationalScopes = ['national', 'national_communication', 'pap_national_manager', 'phoning_national_manager']

const GroupModal = ({ open, group, onCloseResolve, errors, onCreateEditResolve }) => {
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()
  const [currentScope] = useUserScope()
  const isNational = useMemo(() => nationalScopes.includes(currentScope.code), [currentScope.code])

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
    <Dialog open={open} onClose={handleClose} PaperComponent={StyledPaper}>
      <Form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
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
            <TextField formik={formik} label="name" />
          </Grid>
          {errors
            .filter(({ field }) => field === 'name')
            .map(({ field, message }) => (
              <Grid item xs={12} key={field}>
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
          />
        )}

        <Grid container sx={{ mt: 2 }}>
          <Button type="submit" fullWidth>
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
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
}
