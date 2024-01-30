import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'

const AlertContainer = styled(Grid)(
  ({ theme }) => `
    padding: ${theme.spacing(2)};
    margin-bottom: ${theme.spacing(2)};
    background-color: ${theme.palette.blueNewsAlert};
    width: 100%;
    border-radius: 12px;
  `
)

const AlertTitle = styled(Typography)(
  ({ theme }) => `
    font-size: 14px;
    line-height: 21px;
    font-weight: 700;
    color: ${theme.palette.black800};
  `
)

const AlertBody = styled(Typography)(
  ({ theme }) => `
    font-size: 14px;
    line-height: 21px;
    font-weight: 400;
    color: ${theme.palette.black800};
  `
)

const NewsAlert = ({ title, content, image }) => {
  const { isDesktop: showImage } = useCurrentDeviceType()

  return (
    <AlertContainer
      container
      sx={{
        mb: 2,
        ...(showImage && { pb: 0 }),
      }}
    >
      <Grid item xs={showImage ? 9 : 12}>
        <Grid item xs={12}>
          <AlertTitle>{title}</AlertTitle>
        </Grid>
        <AlertBody>{content}</AlertBody>
      </Grid>
      {showImage && (
        <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <img src={image} />
        </Grid>
      )}
    </AlertContainer>
  )
}

NewsAlert.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
}

export default NewsAlert
