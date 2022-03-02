import { useState, useRef } from 'react'
import { Grid, Button, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import 'cropperjs/dist/cropper.css'
import Resizer from 'react-image-file-resizer'
import { styled } from '@mui/system'
import Cropper from 'react-cropper'
import PropTypes from 'prop-types'

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

const HiddenInput = styled('input')`
  display: none;
`

const Image = styled('img')`
  margin-top: ${({ theme }) => theme.spacing(2)}
  width: 100%;
  height: 100%;
`

const StyledCropper = styled(Cropper)`
  width: 100%;
`

const IMAGE_DIMENSIONS = {
  width: '560px',
  height: '140px',
}

const messages = {
  create: 'Enregistrer',
  edit: 'Modifier',
  import: 'Importez une image',
  delete: 'Supprimer',
}

const ImgUploader = ({ image, setImage }) => {
  const [imageToCrop, setImageToCrop] = useState(undefined)
  const [croppedImage, setCroppedImage] = useState(null)
  const inputRef = useRef(null)
  const cropperRef = useRef(null)

  const openGallery = () => {
    if (inputRef?.current !== null) {
      inputRef.current.click()
    }
  }

  const onChange = event => {
    if (event.target.files && event.target.files.length) {
      setImageToCrop(URL.createObjectURL(event.target.files[0]))
      event.target.value = ''
    }
  }

  const onCrop = () => {
    if (cropperRef.current !== null) {
      cropperRef.current.cropper.getCroppedCanvas().toBlob(newCroppedImage => {
        setCroppedImage(newCroppedImage)
      })
    }
  }

  const renderTopPart = () => {
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

  const createOrUpdateBanner = () => {
    if (image !== undefined && imageToCrop === undefined) {
      openGallery()
    } else if (croppedImage !== null) {
      Resizer.imageFileResizer(
        croppedImage,
        IMAGE_DIMENSIONS.width,
        IMAGE_DIMENSIONS.height,
        'base64',
        100,
        0,
        resizedImage => {
          setImage(resizedImage)
          setCroppedImage(null)
          setImageToCrop(undefined)
        },
        'base64',
        IMAGE_DIMENSIONS.width,
        IMAGE_DIMENSIONS.height
      )
    }
  }
  return (
    <Grid container flexDirection="column" justifyContent="center" alignItems="center">
      {renderTopPart()}
      {(image !== undefined && imageToCrop === undefined) || imageToCrop !== undefined ? (
        <Grid container sx={{ mt: 2 }} justifyContent="center" alignItems="center">
          <Button sx={{ color: 'main', mr: 2 }} onClick={createOrUpdateBanner}>
            {image !== undefined && imageToCrop === undefined ? messages.edit : messages.create}
          </Button>
          <Button
            sx={{ color: 'main' }}
            onClick={() => {
              setImage(undefined)
              setImageToCrop(undefined)
            }}
          >
            {messages.delete}
          </Button>
        </Grid>
      ) : null}
      <HiddenInput type="file" ref={inputRef} onChange={onChange} />
    </Grid>
  )
}

ImgUploader.propTypes = {
  image: PropTypes.string,
  setImage: PropTypes.func.isRequired,
}

export default ImgUploader
