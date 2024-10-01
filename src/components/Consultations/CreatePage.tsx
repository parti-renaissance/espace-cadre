import { FormProviderCreateDesignation } from '~/components/Consultations/form'
import MainForm from '~/components/Consultations/FormComponent/MainForm'
import PageHeader from '~/ui/PageHeader'
import { featuresLabels } from '~/shared/features'
import { FeatureEnum } from '~/models/feature.enum'
import { Box, Button, Container, Stack } from '@mui/material'
import { useState } from 'react'
import { DesignationType } from '~/domain/designation'
import Summary from '~/components/Consultations/Summary'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Iconify from '~/mui/iconify'
import { add } from 'date-fns'

const steps = [
  { name: 'Formulaire', route: '' },
  { name: 'Récapitulatif', route: '' },
]

const CreatePage = () => {
  const [previewMode, setPreviewMode] = useState<boolean>(false)
  const [formData, setFormData] = useState<DesignationType>({
    customTitle: '',
    description: '',
    target: [],
    questions: [
      {
        content: '',
        choices: [{ content: '' }, { content: '' }],
      },
    ],
    voteStartDate: add(new Date(), { days: 3, hours: 1 }),
    voteEndDate: add(new Date(), { days: 4, hours: 1 }),
  })

  return (
    <Container maxWidth={false}>
      <Box>
        <PageHeader title={featuresLabels[FeatureEnum.CONSULTATIONS]} />

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
                onClick={() => setPreviewMode(false)}
                startIcon={<Iconify icon={'eva:edit-outline'} />}
              >
                Éditer
              </Button>
              <Button variant={'contained'} startIcon={<Iconify icon={'eva:checkmark-circle-outline'} />}>
                Créer
              </Button>
            </Stack>
          </>
        ) : (
          <FormProviderCreateDesignation>
            <MainForm
              formData={formData}
              onSubmit={data => {
                setFormData(data)
                setPreviewMode(true)
              }}
            />
          </FormProviderCreateDesignation>
        )}
      </Box>
    </Container>
  )
}

export default CreatePage
