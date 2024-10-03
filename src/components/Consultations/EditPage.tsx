import { FormProviderCreateDesignation } from '~/components/Consultations/form'
import MainForm from '~/components/Consultations/FormComponent/MainForm'
import PageHeader from '~/ui/PageHeader'
import { featuresLabels } from '~/shared/features'
import { FeatureEnum } from '~/models/feature.enum'
import { Box, Button, Container, Stack } from '@mui/material'
import { useState } from 'react'
import { Designation, DesignationType, DesignationTypeEnum } from '~/domain/designation'
import Summary from '~/components/Consultations/Summary'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Iconify from '~/mui/iconify'
import { useMutation } from '@tanstack/react-query'
import { createDesignation, updateDesignation } from '~/api/designations'
import { useNavigate } from 'react-router-dom'
import paths from '~/shared/paths'
import { LoadingButton } from '@mui/lab'
import { notifyVariants } from '~/components/shared/notification/constants'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'

const steps = [
  { name: 'Formulaire', route: '' },
  { name: 'Récapitulatif', route: '' },
]

const EditPage = ({ designation = Designation.NULL }: { designation?: Designation }) => {
  const [previewMode, setPreviewMode] = useState<boolean>(false)
  const [formData, setFormData] = useState<DesignationType>(designation.toFormData())

  const navigate = useNavigate()
  const { enqueueSnackbar } = useCustomSnackbar()

  const { mutate, isLoading } = useMutation(
    ['create-designation'],
    (data: DesignationType) => {
      const designationFromForm = Designation.fromFormData(DesignationTypeEnum.Consultation, data, designation.id)

      if (designation.id) {
        return updateDesignation(designationFromForm)
      }

      return createDesignation(designationFromForm)
    },
    {
      onSuccess: () => {
        enqueueSnackbar(
          designation.id ? 'La consultation a bien été modifiée' : 'La consultation a bien été créée',
          notifyVariants.success
        )
        navigate(paths[FeatureEnum.DESIGNATION])
      },
    }
  )

  return (
    <Container maxWidth={false}>
      <Box>
        <PageHeader
          title={featuresLabels[FeatureEnum.DESIGNATION]}
          startButton={
            <Button
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              onClick={() => navigate(paths[FeatureEnum.DESIGNATION])}
            >
              Retour
            </Button>
          }
        />

        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={previewMode ? 1 : 0} alternativeLabel>
            {steps.map(({ name }) => (
              <Step key={name}>
                <StepLabel>{name}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {previewMode ? (
          <>
            <Summary designation={formData} />
            <Stack direction="row" spacing={2} justifyContent={'end'}>
              <Button
                variant={'contained'}
                disabled={isLoading}
                onClick={() => {
                  setPreviewMode(false)
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
                }}
                startIcon={<Iconify icon={'eva:edit-outline'} />}
              >
                Éditer
              </Button>
              <LoadingButton
                variant={'contained'}
                loading={isLoading}
                disabled={isLoading}
                color="success"
                onClick={() => mutate(formData)}
                startIcon={<Iconify icon={'eva:checkmark-circle-outline'} />}
              >
                {designation.isFullyEditable ? 'Programmer le vote' : 'Sauvegarder'}
              </LoadingButton>
            </Stack>
          </>
        ) : (
          <FormProviderCreateDesignation defaultValues={formData} isFullyEditable={designation.isFullyEditable}>
            <MainForm
              isEdition={!!designation.id}
              isFullyEditable={designation.isFullyEditable}
              onSubmit={data => {
                setFormData(data)
                setPreviewMode(true)
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
              }}
            />
          </FormProviderCreateDesignation>
        )}
      </Box>
    </Container>
  )
}

export default EditPage
