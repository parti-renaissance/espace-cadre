import useMediaQuery from '@mui/material/useMediaQuery'

export const useCurrentDeviceType = () => {
  const isDesktop = useMediaQuery(theme => theme.breakpoints.up('sm'), { noSsr: true })
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'), { noSsr: true })
  return { isMobile, isDesktop }
}
