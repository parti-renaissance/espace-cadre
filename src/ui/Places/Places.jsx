import { useCallback, useEffect, useRef, useState } from 'react'
import { styled } from '@mui/system'
import { TextField as MuiTextField } from '@mui/material'
import PropTypes from 'prop-types'
import { Place } from '~/domain/place'
import AlertBanner from '~/ui/AlertBanner'

const TextInput = styled(MuiTextField)(
  ({ theme }) => `
  border-radius: 8px;
  color: ${theme.palette.blackCorner};
  background-color: ${theme.palette.gray100};
  margin-bottom: ${theme.spacing(1)};

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`
)

const messages = {
  address: 'Adresse',
}

const selectPlace = address => {
  if (!address) {
    return Place.NULL
  }

  const number = address.find(a => a.types.includes('street_number'))?.long_name || null
  const route = address.find(a => a.types.includes('route'))?.long_name || null
  const postalCode = address.find(a => a.types.includes('postal_code'))?.long_name || null
  const locality = address.find(a => a.types.includes('locality'))?.long_name || null
  const country = address.find(a => a.types.includes('country'))?.short_name || null

  return new Place(number, route, postalCode, locality, country)
}

const Places = ({ onSelectPlace, initialValue = '', error = null, ...props }) => {
  const [address, setAddress] = useState(initialValue)
  const autoCompleteRef = useRef(null)
  const autoComplete = useRef(null)

  const handlePlaceSelect = useCallback(() => {
    const addressObject = autoComplete.current.getPlace()
    const place = selectPlace(addressObject?.address_components)

    setAddress(place.getAddress())
    onSelectPlace(place)
  }, [autoComplete, setAddress, onSelectPlace])

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
        size="medium"
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
  initialValue: PropTypes.string,
  error: PropTypes.string,
}
