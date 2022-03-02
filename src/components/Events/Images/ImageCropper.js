import { Typography } from '@mui/material'
import { styled } from '@mui/system'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Cropper from 'react-cropper'
import PropTypes from 'prop-types'

const Image = styled('img')`
  margin-top: ${({ theme }) => theme.spacing(2)}
  width: 100%;
  height: 100%;
`

const StyledCropper = styled(Cropper)`
  width: 100%;
`

const InputContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 560px;
  height: 140px;
  border: ${({ theme }) => `1px solid ${theme.palette.gray200}`};
  border-radius: 8px;
`

const PlusIconContainer = styled('div')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.palette.main};
  border-radius: 50%;
  height: 32px;
  width: 32px;
  margin-bottom: ${theme.spacing(2)}
`
)

export const ImageCropper = ({ image, imageToCrop, onCrop, cropperRef }) => {
  if (image !== undefined && imageToCrop === undefined) {
    return <Image src={image} />
  }

  if (imageToCrop !== undefined) {
    return (
      <StyledCropper
        aspectRatio={16 / 9}
        src={imageToCrop}
        cropend={onCrop}
        ready={onCrop}
        ref={cropperRef}
        guides={false}
        modal={false}
        background={false}
        movable={false}
        zoomable={false}
        viewMode={1}
      />
    )
  }

  return (
    <InputContainer onClick={openGallery}>
      <PlusIconContainer>
        <AddRoundedIcon sx={{ color: '#2834C3' }} />
      </PlusIconContainer>
      <Typography>{messages.import}</Typography>
    </InputContainer>
  )
}

ImageCropper.propTypes = {
  image: PropTypes.string,
  imageToCrop: PropTypes.string,
  onCrop: PropTypes.func,
  cropperRef: PropTypes.object,
}
