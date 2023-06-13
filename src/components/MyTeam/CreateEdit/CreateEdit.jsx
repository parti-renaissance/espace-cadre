import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { styled } from '@mui/system'
import { Grid, Typography, IconButton } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import { createOrUpdateTeamMemberQuery } from 'api/my-team'
import { MyTeamMember as DomainMyTeamMember } from 'domain/my-team'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useCurrentDeviceType } from 'components/shared/device/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import CreateEditActivistsAndRoles from './CreateEditActivistsAndRoles'
import CreateEditDelegatedAccess from './CreateEditDelegatedAccess'
import CreateEditValidateAction from './CreateEditValidateAction'
import Dialog from 'ui/Dialog'
import { useUserScope } from '../../../redux/user/hooks'

const Title = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 24px;
`

const messages = {
  create: {
    title: 'Ajouter un membre à mon équipe',
    success: 'Membre ajouté avec succès',
    action: 'Ajouter',
  },
  update: {
    title: 'Modifier un membre de mon équipe',
    success: 'Membre modifié avec succès',
    action: 'Modifier',
  },
}

const validateForm = ({ activist, role }) => !!(activist && Object.keys(activist).length > 0 && role)
const addOrRemoveFeature = (initialFeatures = [], name, selected) => {
  const features = initialFeatures
  if (selected === true && !features.includes(name)) {
    features.push(name)
  }
  if (selected === false && features.includes(name)) {
    features.splice(features.indexOf(name), 1)
  }
  return features
}

const MyTeamCreateEdit = ({ teamId, teamMember, onCreateResolve, handleClose }) => {
  const [currentScope] = useUserScope()
  const [values, setValues] = useState({
    ...teamMember,
    ...{ features: teamMember?.features?.filter(feature => currentScope.hasFeature(feature)) },
  })
  const isValidForm = useMemo(() => validateForm(values), [values])
  const { isMobile, isDesktop } = useCurrentDeviceType()
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()

  const updateValues = useCallback((key, value) => {
    setValues(values => ({ ...values, [key]: value }))
  }, [])

  const updateFeatures = useCallback((key, selected) => {
    setValues(values => ({ ...values, features: addOrRemoveFeature(values.features, key, selected) }))
  }, [])

  const { mutate: createOrUpdateTeamMember, isLoading: isCreateOrUpdateLoading } = useMutation(
    createOrUpdateTeamMemberQuery,
    {
      onSuccess: () => {
        enqueueSnackbar(teamMember ? messages.update.success : messages.create.success, notifyVariants.success)
        onCreateResolve()
        handleClose()
      },
      onError: handleError,
    }
  )

  const handleSubmit = () => {
    createOrUpdateTeamMember({ teamId, teamMember: values })
  }

  return (
    <Dialog data-cy="my-team-create-edit" handleClose={handleClose} open>
      <Grid
        container
        justifyContent={isMobile ? 'flex-end' : 'space-between'}
        alignItems="center"
        sx={{ mt: isMobile ? 2 : null }}
      >
        {isMobile && (
          <IconButton onClick={handleClose} data-cy="my-team-create-edit-action-close">
            <CloseRoundedIcon />
          </IconButton>
        )}
        <Title data-cy="my-team-create-edit-title" sx={isMobile ? { pt: 1 } : null}>
          {!teamMember ? messages.create.title : messages.update.title}
        </Title>
        {isDesktop && (
          <IconButton onClick={handleClose} data-cy="my-team-create-edit-action-close">
            <CloseRoundedIcon />
          </IconButton>
        )}
      </Grid>

      <Grid container sx={{ mb: isMobile ? 2 : null }}>
        <CreateEditActivistsAndRoles values={values} updateValues={updateValues} errors={errorMessages} />
        <CreateEditDelegatedAccess delegatedFeatures={values.features} updateDelegatedFeatures={updateFeatures} />
        <CreateEditValidateAction
          label={!teamMember ? messages.create.action : messages.update.action}
          handleValidate={handleSubmit}
          disabled={!isValidForm || isCreateOrUpdateLoading}
          isLoading={isCreateOrUpdateLoading}
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
