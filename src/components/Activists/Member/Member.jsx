import PropTypes from 'prop-types'
import { Avatar, Box, IconButton, Tab, Typography } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined'
import Activist from '~/domain/activist'
import Badges from '../Badges'
import Subscription from '~/components/Activists/Member/Tabs/Adherent/Subscription'
import { useState } from 'react'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import AdherentTab from '~/components/Activists/Member/Tabs/Adherent/AdherentTab'
import ElectedTab from '~/components/Activists/Member/Tabs/Elected/ElectedTab'
import ConfirmButton from '~/ui/Button/ConfirmButton.jsx'
import { useMutation } from '@tanstack/react-query'
import { notifyVariants } from '~/components/shared/notification/constants.js'
import { useErrorHandler } from '~/components/shared/error/hooks.jsx'
import { useCustomSnackbar } from '~/components/shared/notification/hooks.jsx'
import { sendResubscribeEmail } from '~/api/activist.js'

const Member = ({ enableElectTab, member, handleClose }) => {
  const [currentTab, setCurrentTab] = useState('1')
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const { mutate: sendEmail, isLoading } = useMutation(sendResubscribeEmail, {
    onSuccess: () => enqueueSnackbar('Email envoyé', notifyVariants.success),
    onError: handleError,
  })

  if (!member) {
    return null
  }

  return (
    <Box
      sx={{
        width: '34rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'whiteCorner',
        justifyContent: 'space-between',
      }}
      role="slide-over"
      data-cy="contact-member-detail"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 3,
          color: 'colors.gray.400',
        }}
      >
        <Box display="flex" flexDirection="column" className="space-y-2">
          <Typography variant="h5" sx={{ color: 'colors.gray.800' }}>
            Fiche du militant
          </Typography>
        </Box>
        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          position: 'relative',
          flex: '1 1 0%',
          overflow: 'hidden',
          overflowY: 'scroll',
          height: '100%',
        }}
        className="scrolling-bar"
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '90px',
            zIndex: 1,
            bgcolor: 'colors.blue.900',
          }}
        >
          <div className="heading-banner"></div>
        </Box>
        <Box sx={{ position: 'relative', px: 3, pt: 7, zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }} className="space-x-2">
            <Avatar
              src={member.imageUrl}
              sx={{
                width: 60,
                height: 60,
                bgcolor: 'colors.blue.500',
                border: '2px solid',
                borderColor: 'whiteCorner',
                textTransform: 'uppercase',
              }}
            >
              {member.firstname[0]} {member.lastname[0]}
            </Avatar>
          </Box>
          <Box sx={{ mt: 1 }} className="space-y-2">
            <Typography variant="h6" component="h4" sx={{ color: 'colors.gray.800' }}>
              {member.firstname} {member.lastname}
            </Typography>
            {member.raw.additional_tags.length > 0 && <Badges tags={member.raw.additional_tags} />}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'colors.gray.600' }}>
                <EmailOutlinedIcon sx={{ color: 'colors.gray.400', fontSize: '18px', mr: 1 }} />
                <Typography component="p" sx={{ mr: 1.5 }}>
                  {member.raw.email}
                </Typography>
                <Subscription subscription={member.raw.email_subscription} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'colors.gray.600', mt: 0.5 }}>
                <PhoneIphoneOutlinedIcon sx={{ color: 'colors.gray.400', fontSize: '18px', mr: 1 }} />
                {member.raw.phone ? (
                  <>
                    <Typography component="p" sx={{ mr: 1.5 }}>
                      {member.raw.phone}
                    </Typography>
                    <Subscription subscription={member.raw.sms_subscription} />
                  </>
                ) : (
                  <span>Aucune information</span>
                )}
              </Box>
            </Box>
          </Box>

          {member.raw.available_for_resubscribe_email && (
            <Box sx={{ mt: 2 }}>
              <ConfirmButton
                title="Email de réabonnement"
                disabled={isLoading}
                color="secondary"
                variant="contained"
                description={
                  <Typography component="p">
                    Cette action va envoyer un email de réabonnement à l&apos;adresse {member.raw.email}. Cet email
                    contiendra un bouton permettant le réabonnement en 1 clic.
                    <br />
                    <br />
                    L&apos;email de réabonnement n&apos;est à utiliser que dans le cas où un militant vous dit ne plus
                    recevoir les emails et qu&apos;il souhaite se réabonner. Il ne doit pas être utilisé pour inciter au
                    réabonnement.
                    <br />
                    <br />
                    Le réabonnement est possible à tout moment depuis Profil &gt; Communications pour tous les
                    militants, cependant, il peut être plus simple de recevoir un email pour le faire.
                    <br />
                    <br />
                    Afin d&apos;éviter tout abus, il n&apos;est pas possible d&apos;envoyer plus d&apos;un email de
                    réabonnement par an et par militant. Cet unique envoi est partagé entre tous les cadres.
                  </Typography>
                }
                onClick={() => sendEmail(member.adherentUuid)}
                okButtonTitle="Envoyer l'email"
              >
                Envoyer un email de réabonnement
              </ConfirmButton>
            </Box>
          )}

          <TabContext value={currentTab}>
            <Box sx={{ mt: 2 }}>
              <TabList onChange={(event, newValue) => setCurrentTab(newValue)}>
                <Tab sx={{ textTransform: 'none' }} label={'Adhérent'} value={'1'} />
                {enableElectTab && (
                  <Tab
                    sx={{ textTransform: 'none' }}
                    label={
                      'Élu' +
                      (member.raw.mandates.length
                        ? ' (' +
                          member.raw.mandates.length +
                          ' mandat' +
                          (member.raw.mandates.length > 1 ? 's' : '') +
                          ')'
                        : '')
                    }
                    value={'2'}
                  />
                )}
              </TabList>
            </Box>

            <TabPanel value={'1'}>
              <AdherentTab member={member} />
            </TabPanel>
            {enableElectTab && (
              <TabPanel value={'2'}>
                <ElectedTab adherentUuid={member.adherentUuid} />
              </TabPanel>
            )}
          </TabContext>
        </Box>
      </Box>
    </Box>
  )
}

export default Member

Member.propTypes = {
  member: Activist.propTypes,
  enableElectTab: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
}
