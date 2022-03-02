import { useState, useRef } from 'react'
import { Grid, Button } from '@mui/material'
import 'cropperjs/dist/cropper.css'
import Resizer from 'react-image-file-resizer'
import { styled } from '@mui/system'
import { ImageCropper } from './ImageCropper'
import PropTypes from 'prop-types'

const HiddenInput = styled('input')`
  display: none;
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
      <ImageCropper image={image} imageToCrop={imageToCrop} onCrop={onCrop} cropperRef={cropperRef} />
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
