import { useState, useRef } from 'react'
import { Grid, Button } from '@mui/material'
import 'cropperjs/dist/cropper.css'
import { Resizer } from '~/components/shared/react-image-file-resizer'
import { styled } from '@mui/system'
import { ImageCropper } from './ImageCropper'
import PropTypes from 'prop-types'
import Loader from '~/ui/Loader'

const HiddenInput = styled('input')`
  display: none;
`

const IMAGE_DIMENSIONS = {
  width: '276px',
  height: '130px',
}

const messages = {
  create: 'Enregistrer',
  edit: 'Modifier',
  delete: 'Supprimer',
}

const ImgUploader = ({ image, setImage, handleImageDelete, isDeleting }) => {
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
    <Grid
      container
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ width: '100%', height: 'auto' }}
    >
      <ImageCropper
        image={image}
        imageToCrop={imageToCrop}
        onCrop={onCrop}
        cropperRef={cropperRef}
        openGallery={openGallery}
      />
      {(image !== undefined && imageToCrop === undefined) || imageToCrop !== undefined ? (
        <Grid container sx={{ mt: 2 }} justifyContent="center" alignItems="center">
          <Button sx={{ color: 'main', mr: 2 }} onClick={createOrUpdateBanner}>
            {image !== undefined && imageToCrop === undefined ? messages.edit : messages.create}
          </Button>
          {image !== undefined && (
            <Button sx={{ color: 'main', mr: 2 }} onClick={handleImageDelete} disabled={isDeleting}>
              {isDeleting && <Loader />}&nbsp; {messages.delete}
            </Button>
          )}
        </Grid>
      ) : null}
      <HiddenInput type="file" ref={inputRef} onChange={onChange} accept={'image/*'} />
    </Grid>
  )
}

ImgUploader.propTypes = {
  image: PropTypes.string,
  setImage: PropTypes.func.isRequired,
  handleImageDelete: PropTypes.func,
  isDeleting: PropTypes.bool,
}

export default ImgUploader
