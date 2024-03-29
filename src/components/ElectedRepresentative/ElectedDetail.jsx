import PropTypes from 'prop-types'
import { useState } from 'react'
import { useParams } from 'react-router'
import { Box, Container, Grid, Tooltip, Typography } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddIcon from '@mui/icons-material/Add'
import { DateRange } from '@mui/icons-material'
import { useMutation } from '@tanstack/react-query'
import { getElected, updateElected } from '~/api/elected-representative'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { notifyVariants } from '~/components/shared/notification/constants'
import PageHeader, { PageHeaderButton } from '~/ui/PageHeader/PageHeader'
import EditIcon from '~/ui/icons/EditIcon'
import UICard from '~/ui/Card'
import Button from '~/ui/Button'
import EmptyContent from '~/ui/EmptyContent'
import Loader from '~/ui/Loader'
import { mandates } from '~/shared/constants'
import paths from '~/shared/paths'
import CreateEditMandate from './CreateEditMandate'
import CreateEditModal from './CreateEditModal'
import PaymentBadge from './PaymentBadge'
import { Mandate } from '~/domain/elected_representative'
import { formatDate } from '~/shared/helpers'
import Alert from '~/components/ElectedRepresentative/Alert'

const messages = {
  pageTitle: 'Registre des élus',
  heading: 'Informations générales',
  modify: 'Modifier',
  add: 'Ajouter',
  edit: 'Éditer',
  delete: 'Supprimer',
  associate: 'Cet élu est associé à un compte adhérent',
  noAssociate: "Cet élu n'est pas associé à un compte adhérent",
  mandatesTitle: "Mandats de l'élu",
  noMandates: 'Cet élu ne possède aucun mandat',
  confirmDeleteTitle: 'Suppression du mandat',
  confirmDeleteDescription: 'Êtes-vous sûr de vouloir supprimer ce mandat ?',
  deleteSuccess: 'Mandat supprimé avec succès',
}

const Content = ({ sx, title, content = null, children }) => (
  <Box sx={sx}>
    <Typography sx={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'colors.gray.500' }}>
      {title}
    </Typography>
    <Typography
      sx={{
        display: 'block',
        fontSize: '16px',
        fontWeight: 500,
        mt: 0.5,
        color: 'colors.gray.900',
      }}
    >
      {content ?? content}
      {children}
    </Typography>
  </Box>
)

Content.propTypes = {
  sx: PropTypes.object,
  title: PropTypes.string,
  content: PropTypes.string,
  children: PropTypes.node,
}

const ElectedDetail = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [isMandateModalOpen, setIsMandateModalOpen] = useState(false)
  const [currentMandate, setCurrentMandate] = useState(Mandate.NULL)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { electedId } = useParams()
  const { handleError } = useErrorHandler()

  const {
    data: electedDetail = {},
    refetch,
    isLoading,
  } = useQueryWithScope(
    ['elected-detail', { feature: 'ElectedRepresentative', view: 'ElectedDetail' }, electedId],
    () => getElected(electedId),
    {
      onError: handleError,
    }
  )

  const { mutate, isLoading: updateAdherentLoading } = useMutation(updateElected, {
    onSuccess: () => {
      enqueueSnackbar("L'élu a bien été dissocié du compte adhérent", notifyVariants.success)
      refetch()
    },
  })

  const toggleEditMandateModal = (mandate, open) => {
    setCurrentMandate(mandate)
    setIsMandateModalOpen(open)
  }

  if (isLoading) {
    return <Loader isCenter />
  }

  return (
    <Container maxWidth={false}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.pageTitle}
          titleLink={paths.elected_representative}
          titleSuffix={`${electedDetail.firstName} ${electedDetail.lastName}`}
          button={
            <PageHeaderButton
              label={messages.modify}
              icon={<EditIcon sx={{ color: 'main', fontSize: '20px' }} />}
              onClick={() => setIsCreateEditModalOpen(true)}
              isMainButton
            />
          }
        />
      </Grid>

      <Box className="mt-4 space-y-8">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <UICard
              rootProps={{ sx: { p: 0 } }}
              header={
                <Box
                  sx={{
                    display: 'flex',
                    alignContent: 'center',
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'colors.gray.200',
                  }}
                  className="elected-single__heading"
                >
                  <Typography sx={{ fontSize: '18px', fontWeight: 500, color: 'colors.gray.700' }}>
                    {messages.heading}
                  </Typography>
                </Box>
              }
              content={
                <Box className="space-y-2">
                  <Box sx={{ p: 2 }} className="space-y-2">
                    <Grid container spacing={1} rowGap={1}>
                      <Grid item xs={12} sm={6}>
                        <Content title="Nom complet">
                          {electedDetail.firstName} <span className="font-bold">{electedDetail.lastName}</span>
                        </Content>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Content title="Adresse email" content={electedDetail.emailAddress ?? 'Aucune adresse email'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Content title="Téléphone" content={electedDetail.contactPhone ?? 'Aucun numero'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Content
                          title="Date de naissance"
                          content={
                            electedDetail.birthDate ? formatDate(electedDetail.birthDate, 'dd/MM/yyyy') : 'Aucune date'
                          }
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box
                    sx={{
                      display: {
                        xs: 'block',
                        sm: 'flex',
                      },
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid',
                      borderColor: 'colors.gray.200',
                      p: 2,
                    }}
                  >
                    <Typography sx={{ fontSize: '16px', color: 'colors.gray.600' }}>
                      {electedDetail.adherent ? messages.associate : messages.noAssociate}
                    </Typography>
                    <Box
                      sx={{ mt: { xs: 1, sm: 0 }, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                    >
                      {electedDetail.adherent ? (
                        <Box display="flex" alignItems="center" className="space-x-3">
                          <CheckCircleIcon sx={{ color: 'form.success.color', fontSize: '20px', ml: 2 }} />
                          <Button isMainButton onClick={() => mutate({ adherent: null, uuid: electedDetail.id })}>
                            {updateAdherentLoading && <Loader />}&nbsp; Dissocier
                          </Button>
                        </Box>
                      ) : (
                        <ErrorIcon sx={{ color: 'form.error.color', fontSize: '20px', ml: 2 }} />
                      )}
                    </Box>
                  </Box>
                </Box>
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <UICard
              rootProps={{ sx: { p: 0 } }}
              header={
                <Box
                  sx={{
                    display: 'flex',
                    alignContent: 'center',
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'colors.gray.200',
                  }}
                  className="elected-single__heading"
                >
                  <Typography sx={{ fontSize: '18px', fontWeight: 500, color: 'colors.gray.700' }}>
                    Paiements
                  </Typography>
                </Box>
              }
              content={
                <Box>
                  {electedDetail.payments.length > 0 ? (
                    <Box
                      sx={{
                        maxHeight: '275px',
                        overflow: 'hidden',
                        overflowY: 'scroll',
                      }}
                      className="divider scrolling-bar"
                    >
                      {electedDetail.payments.map(payment => (
                        <Box key={payment.uuid} sx={{ p: 2 }}>
                          <Box>
                            <Typography component="span" sx={{ color: 'colors.gray.500' }}>
                              Du {formatDate(payment.date, 'dd MMMM yyyy')} via
                            </Typography>
                            <Typography component="span" sx={{ color: 'colors.gray.700', fontWeight: '500', px: 1 }}>
                              {payment.method}
                            </Typography>
                          </Box>
                          <Box mt={1} display="flex" alignItems="center" className="space-x-3">
                            <Typography sx={{ color: 'colors.gray.900', fontWeight: '500' }}>
                              {payment.amount ?? 0} €
                            </Typography>
                            <PaymentBadge status={payment.status} labelStyle={{ fontSize: '13px' }} />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography component="h5" sx={{ p: 2, color: 'colors.gray.70' }}>
                      Aucun paiement enregistré
                    </Typography>
                  )}
                </Box>
              }
            />
          </Grid>
        </Grid>

        <Alert />

        <UICard
          rootProps={{ sx: { p: 0 } }}
          header={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'colors.gray.200',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 500, color: 'colors.gray.700', mr: 2 }}>
                  {messages.mandatesTitle}
                </Typography>
              </Box>

              <Tooltip title={"Nous avons migré ces fonctionnalités directement dans l'onglet Militants"}>
                <span>
                  <Button disabled={true} isMainButton onClick={() => toggleEditMandateModal(currentMandate, true)}>
                    {messages.add}
                  </Button>
                </span>
              </Tooltip>
            </Box>
          }
          content={
            <Box className="divider">
              {electedDetail.mandates.length === 0 && (
                <EmptyContent
                  description={messages.noMandates}
                  action={
                    <>
                      <PageHeaderButton
                        label={messages.add}
                        onClick={() => toggleEditMandateModal(currentMandate, true)}
                        icon={<AddIcon />}
                        isMainButton
                      />
                    </>
                  }
                />
              )}
              {electedDetail.mandates.length > 0 &&
                electedDetail.mandates.map(mandate => (
                  <Box key={mandate.id} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flex: '1 1 0%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'colors.blue.500' }}>
                          {mandates[mandate.type]}
                          {mandate.geoZone && (
                            <Typography sx={{ color: 'colors.gray.700' }}>
                              {` - ${mandate.geoZone.name} (${mandate.geoZone.code})`}
                            </Typography>
                          )}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <DateRange sx={{ color: 'colors.gray.400', fontSize: '20px' }} />
                        <Typography sx={{ fontSize: '16px', color: 'colors.gray.700', ml: 1 }}>
                          {mandate.onGoing
                            ? `Depuis le ${formatDate(mandate.beginAt, 'dd/MM/yyyy')}`
                            : `Du ${formatDate(mandate.beginAt, 'dd/MM/yyyy')} au ${formatDate(
                                mandate.finishAt,
                                'dd/MM/yyyy'
                              )}`}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', ml: 2 }}>
                      <Tooltip title={"Nous avons migré ces fonctionnalités dans l'onglet Militants"}>
                        <span>
                          <Button isMainButton disabled={true} onClick={() => toggleEditMandateModal(mandate, true)}>
                            {messages.edit}
                          </Button>
                        </span>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
            </Box>
          }
        />
      </Box>

      {isCreateEditModalOpen && (
        <CreateEditModal
          elected={electedDetail}
          onUpdateResolve={refetch}
          handleClose={() => setIsCreateEditModalOpen(false)}
        />
      )}

      {isMandateModalOpen && (
        <CreateEditMandate
          electedId={electedId}
          mandate={currentMandate}
          onUpdateResolve={refetch}
          handleClose={() => toggleEditMandateModal(Mandate.NULL, false)}
        />
      )}
    </Container>
  )
}

export default ElectedDetail
