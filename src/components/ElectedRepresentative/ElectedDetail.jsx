import PropTypes from 'prop-types'
import { useState } from 'react'
import { useParams } from 'react-router'
import { Box, Container, Grid, Typography } from '@mui/material'
import { format } from 'date-fns'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { DateRange } from '@mui/icons-material'
import { useMutation } from '@tanstack/react-query'
import { deleteMandate, getElected, updateElected } from 'api/elected-representative'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import PageHeader, { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import EditIcon from 'ui/icons/EditIcon'
import UICard from 'ui/Card/Card'
import Button from 'ui/Button'
import EmptyContent from 'ui/EmptyContent'
import Loader from 'ui/Loader'
import ConfirmButton from 'ui/Button/ConfirmButton'
import { mandats } from 'shared/constants'
import paths from 'shared/paths'
import CreateEditMandate from './CreateEditMandate'
import CreateEditModal from './CreateEditModal'

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
  const [mandate, setMandate] = useState(null)
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

  const { mutate: removeMandate, isLoading: loading } = useMutation(deleteMandate, {
    onSuccess: () => {
      enqueueSnackbar(messages.deleteSuccess, notifyVariants.success)
      refetch()
    },
    onError: handleError,
  })

  const { mutate, isLoading: updateAdherentLoading } = useMutation(updateElected, {
    onSuccess: () => {
      enqueueSnackbar("L'élu a bien été dissocié du compte adhérent", notifyVariants.success)
      refetch()
    },
  })

  const toggleEditMandateModal = (mandate, open) => {
    setMandate(mandate)
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
          titleSuffix={`${electedDetail.first_name} ${electedDetail.last_name}`}
          button={
            <PageHeaderButton
              label={messages.modify}
              icon={<EditIcon sx={{ color: 'main', fontSize: '20px' }} />}
              onClick={() => (Object.keys(electedDetail).length > 0 ? setIsCreateEditModalOpen(true) : null)}
              isMainButton
            />
          }
        />
      </Grid>
      <Box className="space-y-8">
        <UICard
          rootProps={{ sx: { p: 0 } }}
          header={
            <Box
              sx={{
                display: 'flex',
                alignContent: 'center',
                p: 2,
                borderBottom: '1px solid',
                borderColor: theme => theme.palette.colors.gray[200],
              }}
              className="elected-single__heading"
            >
              <Typography sx={{ fontSize: '18px', fontWeight: 500, color: theme => theme.palette.colors.gray[700] }}>
                {messages.heading}
              </Typography>
            </Box>
          }
          content={
            <Box className="space-y-2">
              <Box sx={{ p: 2 }} className="space-y-2">
                <Grid container spacing={1}>
                  <Grid item xs={6} md={4}>
                    <Content title="Nom complet">
                      {electedDetail.first_name} <span className="font-bold">{electedDetail.last_name}</span>
                    </Content>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Content title="Adresse E-mail" content={electedDetail.email_address ?? 'Aucune adresse e-mail'} />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Content title="Téléphone" content={electedDetail.phone_number ?? 'Aucun numero'} />
                  </Grid>
                </Grid>
                <Content
                  title="Date de naissance"
                  content={
                    electedDetail.birth_date ? format(new Date(electedDetail.birth_date), 'dd/MM/yyyy') : 'Aucune date'
                  }
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid',
                  borderColor: 'colors.gray.200',
                  py: 2,
                  px: 2,
                }}
              >
                <Typography sx={{ fontSize: '16px', color: 'colors.gray.600' }}>
                  {electedDetail.adherent ? messages.associate : messages.noAssociate}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  {electedDetail.adherent ? (
                    <Box display="flex" alignItems="center" className="space-x-3">
                      <Button isMainButton onClick={() => mutate({ adherent: null, uuid: electedDetail.uuid })}>
                        {updateAdherentLoading && <Loader />}&nbsp; Dissocier
                      </Button>
                      <CheckCircleIcon sx={{ color: 'form.success.color', fontSize: '20px', ml: 2 }} />
                    </Box>
                  ) : (
                    <ErrorIcon sx={{ color: 'form.error.color', fontSize: '20px', ml: 2 }} />
                  )}
                </Box>
              </Box>
            </Box>
          }
        />
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
                borderColor: theme => theme.palette.colors.gray[200],
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{ fontSize: '18px', fontWeight: 500, color: theme => theme.palette.colors.gray[700], mr: 2 }}
                >
                  {messages.mandatesTitle}
                </Typography>
                {loading && <Loader />}
              </Box>
              <Button isMainButton onClick={() => toggleEditMandateModal(null, true)}>
                {messages.add}
              </Button>
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
                        onClick={() => toggleEditMandateModal(null, true)}
                        icon={<AddIcon />}
                        isMainButton
                      />
                    </>
                  }
                />
              )}
              {electedDetail.mandates.length > 0 &&
                electedDetail.mandates.map(mandate => (
                  <Box key={mandate.uuid} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flex: '1 1 0%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography
                          sx={{ fontSize: '14px', fontWeight: 500, color: theme => theme.palette.colors.blue[500] }}
                        >
                          {mandats[mandate.type]}
                          <Typography sx={{ color: theme => theme.palette.colors.gray[700] }}>
                            {` - ${mandate.geo_zone.name} (${mandate.geo_zone.code})`}
                          </Typography>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <DateRange sx={{ color: theme => theme.palette.colors.gray[400], fontSize: '20px' }} />
                        <Typography sx={{ fontSize: '16px', color: theme => theme.palette.colors.gray[700], ml: 1 }}>
                          {mandate.on_going
                            ? `Depuis le ${format(new Date(mandate.begin_at), 'dd/MM/yyyy')}`
                            : `Du ${format(new Date(mandate.begin_at), 'dd/MM/yyyy')} au ${format(
                                new Date(mandate.finish_at),
                                'dd/MM/yyyy'
                              )}`}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', ml: 2 }}>
                      <Button isMainButton onClick={() => toggleEditMandateModal(mandate, true)}>
                        {messages.edit}
                      </Button>

                      <ConfirmButton
                        title={messages.confirmDeleteTitle}
                        description={messages.confirmDeleteDescription}
                        onClick={() => removeMandate(mandate.uuid)}
                      >
                        <DeleteIcon sx={{ color: theme => theme.palette.form.error.color, fontSize: '20px' }} />
                      </ConfirmButton>
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
          mandate={mandate}
          onUpdateResolve={refetch}
          handleClose={() => toggleEditMandateModal(null, false)}
        />
      )}
    </Container>
  )
}

export default ElectedDetail
