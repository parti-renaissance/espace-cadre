import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { useMutation } from 'react-query'
import { styled } from '@mui/system'
import { Grid, Typography, Dialog, IconButton, Paper as MuiPaper } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import { createOrUpdateTeamMemberQuery } from 'api/my-team'
import { MyTeamMember as DomainMyTeamMember } from 'domain/my-team'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import CreateEditActivistsAndRoles from './CreateEditActivistsAndRoles'
import CreateEditDelegatedAccess from './CreateEditDelegatedAccess'
import CreateEditValidateAction from './CreateEditValidateAction'

const Title = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 24px;
`

const Paper = styled(MuiPaper)(
  ({ theme }) => `
	padding: ${theme.spacing(4)};
	width: 664px;
	border-radius: 12px;
`
)

const messages = {
  create: {
    title: 'Ajouter un membre à mon équipe',
    success: 'Délégation effectuée avec succès',
    action: 'Ajouter',
  },
  update: {
    title: 'Modifier un membre de mon équipe',
    success: 'Délégation modifiée avec succès',
    action: 'Modifier',
  },
}

const validateForm = ({ activist, position }) => activist && Object.keys(activist).length > 0 && position

const MyTeamCreateEdit = ({ teamId, teamMember, onCreateResolve, handleClose }) => {
  const [values, setValues] = useState(teamMember || {})
  const isValidForm = useMemo(() => validateForm(values), [values])
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()

  const updateValues = useCallback((key, value) => {
    setValues(values => ({ ...values, [key]: value }))
  }, [])

  const { mutate: createOrUpdateTeamMember } = useMutation(createOrUpdateTeamMemberQuery, {
    onSuccess: () => {
      enqueueSnackbar(teamMember ? messages.update.success : messages.create.success, notifyVariants.success)
      onCreateResolve()
      handleClose()
    },
    onError: handleError,
  })

  const handleSubmit = () => {
    createOrUpdateTeamMember({ teamId, ...values })
  }

  return (
    <Dialog scroll="body" data-cy="my-team-create-edit" onClose={handleClose} PaperComponent={Paper} open>
      <Grid container justifyContent="space-between" alignItems="center">
        <Title>{!teamMember ? messages.create.title : messages.update.title}</Title>
        <IconButton onClick={handleClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Grid>

      <Grid container>
        <CreateEditActivistsAndRoles values={values} updateValues={updateValues} />
        <CreateEditDelegatedAccess features={values.features} updateFeatures={updateValues} />
        <CreateEditValidateAction
          label={!teamMember ? messages.create.action : messages.update.action}
          handleValidate={handleSubmit}
          disabled={!isValidForm}
        />
      </Grid>
    </Dialog>
  )
}

MyTeamCreateEdit.propTypes = {
  teamId: PropTypes.string,
  teamMember: PropTypes.shape(DomainMyTeamMember.propTypes),
  onCreateResolve: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
}

export default MyTeamCreateEdit
