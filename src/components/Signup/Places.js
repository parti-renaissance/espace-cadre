import { useCallback, useEffect, useRef, useState } from 'react'
import { styled } from '@mui/system'
import { TextField as MuiTextField } from '@mui/material'
import PropTypes from 'prop-types'
import { Place } from 'domain/place'
import AlertBanner from 'ui/AlertBanner'

const TextInput = styled(MuiTextField)(
  ({ theme }) => `
  border-color: ${theme.palette.gray200};
  border-radius: 8px;
  color: ${theme.palette.blackCorner};
  background-color: ${theme.palette.gray100};
`
)

const selectPlace = (address, cb) => {
  const number = address.find(a => a.types.includes('street_number'))?.long_name || null
  const route = address.find(a => a.types.includes('route'))?.long_name || null
  const postalCode = address.find(a => a.types.includes('postal_code'))?.long_name || null
  const locality = address.find(a => a.types.includes('locality'))?.long_name || null
  const country = address.find(a => a.types.includes('country'))?.short_name || null

  cb(new Place(number, route, postalCode, locality, country))

  return [number, number && ' ', route].filter(Boolean).join('')
}

const messages = {
  address: 'Adresse',
}

const Places = ({ onSelectPlace, error = null, ...props }) => {
  const [address, setAddress] = useState('')
  const autoCompleteRef = useRef(null)
  const autoComplete = useRef(null)

  const handlePlaceSelect = useCallback(() => {
    const addressObject = autoComplete.current.getPlace()
    const formatedAdress = selectPlace(addressObject.address_components, onSelectPlace)
    setAddress(formatedAdress)
  }, [onSelectPlace])

  useEffect(() => {
    autoComplete.current = new window.google.maps.places.Autocomplete(autoCompleteRef.current, {
      fields: ['address_components'],
      types: ['address'],
    })
    autoComplete.current.addListener('place_changed', handlePlaceSelect)
  }, [handlePlaceSelect])

  return (
    <>
      <TextInput
        {...props}
        inputRef={autoCompleteRef}
        onChange={event => setAddress(event.target.value)}
        fullWidth
        size="small"
        variant="outlined"
        id="adress"
        name="address"
        inputProps={{ maxLength: 500 }}
        placeholder={messages.address}
        value={address}
        error={!!error}
      />
      {error && <AlertBanner severity="error" message={error} />}
    </>
  )
}

export default Places

Places.propTypes = {
  onSelectPlace: PropTypes.func.isRequired,
  error: PropTypes.string,
}
