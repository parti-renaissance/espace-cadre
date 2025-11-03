import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  DialogContent,
  Dialog,
  IconButton,
  SvgIcon,
  Chip,
} from '@mui/material'
import { useState } from 'react'
import KpiEmailCampaign from '~/components/Dashboard/Charts/KpiEmailCampaign'
import SentEmailCampaigns from '~/components/Dashboard/Charts/SentEmailCampaigns/SentEmailCampaigns'
import { paths as messageriePaths } from '~/components/Messagerie/shared/paths'
import PageHeader from '~/ui/PageHeader'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import Templates from '../Templates'
import { FeatureEnum } from '~/models/feature.enum'
import publicationFeatureImage from '~/assets/image_publication.png'
import oldEmailingFeatureImage from '~/assets/image_emailing.png'
import Iconify from '~/mui/iconify/'
import { useUserScope } from '~/redux/user/hooks'
import pluralize from '~/components/shared/pluralize/pluralize'
import CloseIcon from '@mui/icons-material/Close'
import CheckSvg from '~/assets/check.svg?react'
import XSvg from '~/assets/x.svg?react'
import Badge from '@mui/material/Badge'

const messages = {
  title: 'Échange',
  sendEmail: 'Écrire un email',
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [showTemplates, setShowTemplates] = useState(false)
  const { isMobile } = useCurrentDeviceType()
  const [currentScope] = useUserScope()
  const [modalOpen, setModalOpen] = useState(false)

  const isPublicationsFeatureEnabled = currentScope.hasFeature(FeatureEnum.PUBLICATIONS)

  return (
    <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {isPublicationsFeatureEnabled && (
        <Card sx={{ backgroundColor: '#ECE2FF', border: '1px solid #D4C2FF' }}>
          <Grid container alignItems="flex-start" justifyContent="space-between" sx={{ padding: '24px' }}>
            <Grid item xs={12} sm={10} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    backgroundColor: '#F7F2FF',
                    color: '#714991',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                >
                  Nouveau
                </Typography>
              </Box>
              <Typography sx={{ color: '#714991', fontWeight: 500, fontSize: '16px' }}>
                Utilisez maintenant les publications plutôt que les emails classiques. Directement depuis l&apos;espace
                militant, elles sont plus faciles à concevoir et vos publications sont à la fois envoyées par email et
                visibles sur l&apos;accueil de l&apos;espace de vos militants !
              </Typography>
              <Grid marginTop={2}>
                <Button
                  variant="contained"
                  color="inherit"
                  size="medium"
                  data-cy="ui-page-header-button"
                  sx={{
                    backgroundColor: '#714991',
                    '&:hover': { backgroundColor: '#5A3B7A' },
                  }}
                  startIcon={<Iconify icon="solar:document-text-bold" />}
                  onClick={() => window.open('https://app.parti-renaissance.fr/publications', '_blank')}
                >
                  J&apos;essaye les publications
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      )}
      <Box>
        <Grid container justifyContent="space-between" sx={{ mb: isMobile ? 2 : null }}>
          <PageHeader
            title={messages.title}
            button={
              <Stack alignItems="center" direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="inherit"
                  size="medium"
                  data-cy="ui-page-header-button"
                  startIcon={<Iconify icon="solar:pen-bold" color="white" />}
                  onClick={() => setModalOpen(true)}
                >
                  {messages.sendEmail}
                </Button>

                <Button
                  variant="outlined"
                  color="inherit"
                  size="medium"
                  data-cy="templates-button"
                  onClick={() => setShowTemplates(true)}
                >
                  À partir d&apos;une template
                </Button>
              </Stack>
            }
          />
        </Grid>
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth={'xl'}>
          <IconButton
            aria-label="close"
            onClick={() => setModalOpen(false)}
            sx={theme => ({
              position: 'absolute',
              right: 24,
              top: 24,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ padding: 4, maxWidth: '800px' }}>
            <Grid container direction="column" gap={4} alignItems="center" justifyContent="center">
              <Grid item>
                <Typography>Choisissez votre méthode de publication</Typography>
              </Grid>

              <Grid item>
                <Grid container direction="row" spacing={3} alignItems="stretch">
                  <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    <Grid container gap={2} sx={{ padding: 2, border: 1, borderColor: '#6B4B8D', borderRadius: 2 }}>
                      <Grid container wrap="nowrap" justifyContent="space-between">
                        <Grid item>
                          <Typography fontWeight="bold" fontSize={18}>
                            Nouveau système de publication
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Chip
                            label="Recommandé"
                            variant="filled"
                            size="small"
                            sx={{
                              fontWeight: 'bold',
                              fontSize: 12,
                              background: '#697AF7',
                              borderRadius: '999px',
                            }}
                          />
                        </Grid>
                      </Grid>
                      <img
                        src={publicationFeatureImage}
                        alt="Nouveau système de publication"
                        style={{ borderRadius: 8 }}
                      />
                      <Grid container direction="column">
                        <Grid item alignItems="center" gap={1} sx={{ display: 'flex' }}>
                          <SvgIcon component={CheckSvg} />
                          <Typography fontSize={14} color={'#232B35'}>
                            Utilisation simplifiée
                          </Typography>
                        </Grid>
                        <Grid item alignItems="center" gap={1} sx={{ display: 'flex' }}>
                          <SvgIcon component={CheckSvg} />
                          <Typography fontSize={14} color={'#232B35'}>
                            Publication dans le fil de l’app
                          </Typography>
                        </Grid>
                        <Grid item alignItems="center" gap={1} sx={{ display: 'flex' }}>
                          <SvgIcon component={CheckSvg} />
                          <Typography fontSize={14} color={'#232B35'}>
                            Envoi par email
                          </Typography>
                        </Grid>
                        <Grid item alignItems="center" gap={1} sx={{ display: 'flex' }}>
                          <SvgIcon component={CheckSvg} />
                          <Typography fontSize={14} color={'#232B35'}>
                            Système de notifications
                          </Typography>
                        </Grid>
                        <Grid item alignItems="center" gap={1} sx={{ display: 'flex' }}>
                          <SvgIcon component={CheckSvg} />
                          <Typography fontSize={14} color={'#232B35'}>
                            Statistiques détaillées
                          </Typography>
                        </Grid>
                      </Grid>
                      <Button
                        variant="contained"
                        onClick={() => window.open('https://app.parti-renaissance.fr/publications')}
                        fullWidth
                        sx={{ background: '#6B4B8D', color: '#ffffff', padding: '8px 16px' }}
                      >
                        Créer une publication
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    <Grid container gap={2} sx={{ padding: 2, border: 1, borderColor: '#949EAA', borderRadius: 2 }}>
                      <Typography fontWeight="bold" fontSize={18}>
                        Ancien système
                        <br />
                        d’emailing
                      </Typography>
                      <img src={oldEmailingFeatureImage} alt="Ancien système d’emailing" style={{ borderRadius: 8 }} />
                      <Grid container direction="column">
                        <Grid item alignItems="center" gap={1} sx={{ display: 'flex' }}>
                          <SvgIcon component={CheckSvg} />
                          <Typography fontSize={14} color={'#232B35'}>
                            Utilisation simplifiée
                          </Typography>
                        </Grid>
                        <Grid item alignItems="center" gap={1} sx={{ display: 'flex' }}>
                          <SvgIcon component={XSvg} />
                          <Typography fontSize={14} color={'#949EAA'}>
                            Publication dans le fil de l’app
                          </Typography>
                        </Grid>
                        <Grid item alignItems="center" gap={1} sx={{ display: 'flex' }}>
                          <SvgIcon component={CheckSvg} />
                          <Typography fontSize={14} color={'#232B35'}>
                            Envoi par email
                          </Typography>
                        </Grid>
                        <Grid item alignItems="center" gap={1} sx={{ display: 'flex' }}>
                          <SvgIcon component={XSvg} />
                          <Typography fontSize={14} color={'#949EAA'}>
                            Système de notifications
                          </Typography>
                        </Grid>
                        <Grid item alignItems="center" gap={1} sx={{ display: 'flex' }}>
                          <SvgIcon component={XSvg} />
                          <Typography fontSize={14} color={'#949EAA'}>
                            Statistiques détaillées
                          </Typography>
                        </Grid>
                      </Grid>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`${messageriePaths.create}/${messageriePaths.createNewsletter}`)}
                        fullWidth
                        sx={{ background: '#F7F0FE', color: '#6B4B8D', border: 0, padding: '8px 16px' }}
                      >
                        Utiliser l’ancien système
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
        <div>
          <KpiEmailCampaign />
        </div>
      </Box>
      <Grid container>
        <Grid item xs={12}>
          <SentEmailCampaigns />
        </Grid>
      </Grid>

      {showTemplates && <Templates handleClose={() => setShowTemplates(false)} />}
    </Container>
  )
}

export default Dashboard
