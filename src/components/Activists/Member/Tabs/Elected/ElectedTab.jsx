import { useQueryWithScope } from 'api/useQueryWithScope'
import { deleteMandate, getAdherentElect } from 'api/activist'
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
import PropTypes from 'prop-types'
import { formatDate } from 'shared/helpers'
import Badge from 'ui/Badge/Badge'
import { parseMandates } from 'components/Activists/helper'
import BadgesList from 'ui/Badge/BadgesList'

const ElectedTab = ({ adherentUuid }) => {
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()
  const [mandate, setMandate] = useState(null)

  const {
    data: adherentElect,
    isFetching,
    refetch,
  } = useQueryWithScope(['adherent-elect', adherentUuid], () => getAdherentElect(adherentUuid), {
    onError: handleError,
  })

  const { mutate: removeMandate } = useMutation(deleteMandate, {
    onSuccess: () => {
      enqueueSnackbar('Mandat supprimé', notifyVariants.success)
      refetch()
    },
    onError: handleError,
  })

  if (isFetching) {
    return <Loader isCenter />
  } else if (!adherentElect) {
    return null
  }

  const ongoingMandates = adherentElect.elect_mandates.filter(m => !m.finish_at)
  const finishedMandates = adherentElect.elect_mandates.filter(m => m.finish_at)

  return (
    <Box sx={{ mt: 2 }} className="space-y-4">
      {adherentElect.mandates.length > 0 && (
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
                  <BadgesList badges={parseMandates([], adherentElect.mandates)} />
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
                mandate={MandateObject.fromApi(mandate)}
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
                mandate={MandateObject.fromApi(mandate)}
                key={mandate.uuid}
                removeAction={removeMandate}
                editAction={m => setMandate(m)}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          bgcolor: 'colors.gray.50',
          px: 2,
          py: 2.5,
          borderRadius: 2,
        }}
      >
        <Box>
          <Grid container direction="column" spacing={1}>
            <Grid item xs={12}>
              <Typography component="h4" sx={{ color: 'colors.gray.700', fontSize: '14px', fontWeight: '500' }}>
                Cotisations d&apos;élu
              </Typography>
            </Grid>

            <Grid item sx={{ mb: 1.5 }} xs={12}>
              <Box className="space-y-3">
                {adherentElect.payments.length > 0
                  ? adherentElect.payments.map((p, index) => (
                      <Box
                        key={p.uuid}
                        sx={{
                          paddingTop: 1.5,
                          borderTop: index !== 0 ? '1px solid' : 'none',
                          borderColor: 'colors.gray.700',
                        }}
                      >
                        <Grid container justifyContent={'space-between'}>
                          <Grid item>
                            <Typography sx={{ color: 'colors.gray.500', fontSize: '14px', fontWeight: '500' }}>
                              {formatDate(new Date(p.date), 'dd/MM/yyyy')} via {p.method}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Badge badge={{ label: p.status_label }} />
                          </Grid>
                          <Grid item xs={12}>
                            {p.amount} €
                          </Grid>
                        </Grid>
                      </Box>
                    ))
                  : '--'}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {mandate && (
        <MandateModalForm
          adherentUuid={adherentUuid}
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
  adherentUuid: PropTypes.string.isRequired,
}

export default ElectedTab
