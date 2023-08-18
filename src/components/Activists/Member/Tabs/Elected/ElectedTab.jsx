import Activist from 'domain/activist'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { deleteMandate, getMandates } from 'api/activist'
import Loader from 'ui/Loader'
import { Box, Grid, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import Button from 'ui/Button'
import { Add } from '@mui/icons-material'
import Mandate from 'components/Activists/Member/Tabs/Elected/Mandate'
import { Mandate as MandateObject } from 'domain/mandate'
import MandateModalForm from 'components/Activists/Member/Tabs/Elected/MandateForm'
import { useState } from 'react'
import { UIChip } from 'ui/Card'

const ElectedTab = ({ member }) => {
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()
  const [mandate, setMandate] = useState(null)

  const {
    data: adherentMandates = [],
    isFetching,
    refetch,
  } = useQueryWithScope(['mandates', member.adherentUuid], async () => {
    const mandates = await getMandates(member.adherentUuid)

    return [mandates.filter(m => m.onGoing), mandates.filter(m => !m.onGoing)]
  })

  const { mutate: removeMandate } = useMutation(deleteMandate, {
    onSuccess: () => {
      enqueueSnackbar('Mandat supprimé', notifyVariants.success)
      refetch()
    },
    onError: handleError,
  })

  const [ongoingMandates, finishedMandates] = adherentMandates

  if (isFetching) {
    return <Loader isCenter />
  }

  return (
    <Box sx={{ mt: 2 }} className="space-y-4">
      {member.raw.declared_mandates.length > 0 && (
        <Box
          sx={{
            bgcolor: 'colors.gray.50',
            px: 2,
            py: 2.5,
            borderRadius: 2,
          }}
        >
          <Box>
            <Grid container direction="column" justifyContent="space-between" alignItems="baseline" spacing={1}>
              <Grid item>
                <Typography component="h4" sx={{ color: 'colors.gray.700', fontSize: '14px', fontWeight: '500' }}>
                  Déclarations de mandats
                </Typography>
              </Grid>

              <Grid item sx={{ mb: 1.5 }}>
                <Box display="flex" alignItems="center" flexWrap="wrap" className="space-x-2">
                  {member.raw.declared_mandates.map(m => (
                    <UIChip
                      key={m}
                      label={m}
                      color="colors.green.800"
                      bgcolor="#fff"
                      labelStyle={{ fontSize: '12px', fontWeight: '600' }}
                      sx={{ display: 'flex', width: 'fit-content', py: 1, border: 2 }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>

            <Typography component="p" sx={{ color: 'colors.gray.500', fontSize: '13px', mb: 1.5 }}>
              Les déclarations de mandat sont à réaliser par l&apos;adhérent au moment de son adhésion ou depuis son
              profil. Elles ne sont qu&apos;informatives, vous devez les vérifier et ajouter des mandats ci-dessous pour
              faire de cet adhérent un élu dans votre base de données.
            </Typography>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          bgcolor: 'colors.gray.50',
          px: 2,
          py: 2.5,
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Grid container direction="row" justifyContent="space-between" alignItems="baseline" spacing={1}>
            <Grid item>
              <Typography
                component="h4"
                sx={{ color: 'colors.gray.700', fontSize: '14px', fontWeight: '500', mb: 1.5 }}
              >
                Mandats en cours
              </Typography>
            </Grid>

            <Grid item>
              <Button
                isMainButton
                onClick={() => {
                  setMandate(MandateObject.NULL)
                }}
                size="small"
                sx={{ fontSize: 12 }}
              >
                <Add />
                <Box>Ajouter un mandat</Box>
              </Button>
            </Grid>
          </Grid>

          <Typography component="p" sx={{ color: 'colors.gray.500', fontSize: '13px', mb: 1.5 }}>
            En déclarant des mandats à cet adhérent, vous en ferez un élu dans votre base de données. Celui-ci sara
            alors invité à déclarer son indemnité d&apos;élu et selon le montant, cotiser auprès du parti.
          </Typography>

          {ongoingMandates.length > 0 ? (
            ongoingMandates.map(mandate => (
              <Mandate
                mandate={mandate}
                key={mandate.uuid}
                removeAction={removeMandate}
                editAction={m => setMandate(m)}
              />
            ))
          ) : (
            <Typography sx={{ color: 'colors.gray.500', fontSize: '12px', mb: 1.5 }}>Aucun mandat</Typography>
          )}
        </Box>

        {finishedMandates.length > 0 && (
          <Box
            sx={{
              borderTop: '1px solid',
              borderTopColor: 'colors.gray.200',
              pt: 2,
            }}
          >
            <Typography component="h4" sx={{ color: 'colors.gray.700', fontSize: '14px', fontWeight: '500', mb: 1.5 }}>
              Mandats fermés
            </Typography>

            {finishedMandates.map(mandate => (
              <Mandate
                mandate={mandate}
                key={mandate.uuid}
                removeAction={removeMandate}
                editAction={m => setMandate(m)}
              />
            ))}
          </Box>
        )}
      </Box>

      {mandate && (
        <MandateModalForm
          adherentUuid={member.adherentUuid}
          mandate={mandate}
          handleClose={(needRefetch = false) => {
            setMandate(null)

            if (typeof needRefetch === 'boolean' && needRefetch) {
              refetch()
            }
          }}
        />
      )}
    </Box>
  )
}

ElectedTab.propTypes = {
  member: Activist.propTypes.isRequired,
}

export default ElectedTab
