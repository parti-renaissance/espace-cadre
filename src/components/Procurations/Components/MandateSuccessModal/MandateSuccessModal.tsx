import ModalBase from '~/components/ModalBase/ModalBase'
import styled from '@emotion/styled'
import { Button, Grid, Typography } from '@mui/material'
import { success } from '~/theme/palette'
import { CssSpacing, MuiSpacing } from '~/theme/spacing'
import heart from './Assets/SuccessHeartImage.svg'
import { fontWeight } from '~/theme/typography'
import { memo } from 'react'
import Iconify from '~/mui/iconify'

interface MandateSuccessModalProps {
  onClose: () => void
  mandate: string
  proxy: string
}

function MandateSuccessModal({ onClose, mandate, proxy }: MandateSuccessModalProps) {
  return (
    <ModalBase onClose={onClose} pageOnMobile>
      <Grid container spacing={2}>
        <Grid item sx={{ display: { xs: 'block', sm: 'none' } }}>
          <Button startIcon={<Iconify icon="eva:arrow-ios-back-fill" />} onClick={onClose}>
            Retour
          </Button>
        </Grid>

        <Grid item xs={12}>
          <SuccessContainer>
            <Iconify height={20} icon="eva:info-fill" color={success.main} style={{ paddingRight: CssSpacing.small }} />
            <Typography color={'success.main'} fontSize={14}>
              Mandataire traité avec succès
            </Typography>
          </SuccessContainer>
        </Grid>

        <Grid item xs={12}>
          <CenteredImage src={heart} />
        </Grid>

        <Grid item xs={12} textAlign="center">
          <Typography fontSize={18} fontWeight={fontWeight.medium}>
            Bravo, {mandate} et {proxy} sont liés !
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography fontSize={16}>
            Ils viennent tous les deux de recevoir un email de mise en relation dont vous êtes en copie.
          </Typography>
        </Grid>

        <Grid item xs={12} mb={MuiSpacing.large}>
          <Typography fontSize={16}>Prêt pour gagner une nouvelle voix ?</Typography>
        </Grid>

        <Grid container justifyContent={'flex-end'}>
          <Grid item xs={12} sm={6} lg={4}>
            <Button variant="contained" onClick={onClose} fullWidth>
              On continue
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </ModalBase>
  )
}

const SuccessContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: success.lighter,
  borderColor: success.light,
  borderWidth: 1,
  borderRadius: 4,
  padding: CssSpacing.normal,
  alignItems: 'center',
})

const CenteredImage = styled.img({
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: 120,
})

export default memo(MandateSuccessModal)
