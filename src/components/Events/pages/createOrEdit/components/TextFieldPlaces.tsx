import { useCallback, useEffect, useRef, useState } from 'react'
import { TextField } from '@mui/material'
import { Place } from '~/domain/place'

const messages = {
  address: 'Adresse',
}

const selectPlace = (address: google.maps.GeocoderAddressComponent[] | undefined) => {
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

type TextFieldPlacesProps = {
  onSelectPlace: (place: Place) => void
  initialValue?: string
} & React.ComponentProps<typeof TextField>

const TextFieldPlaces = ({ onSelectPlace, initialValue = '', ...props }: TextFieldPlacesProps) => {
  const [address, setAddress] = useState(initialValue)
  const autoCompleteRef = useRef<HTMLInputElement | null>(null)
  const autoComplete = useRef<google.maps.places.Autocomplete | null>(null)

  const handlePlaceSelect = useCallback(() => {
    const addressObject = autoComplete?.current?.getPlace()
    const place = selectPlace(addressObject?.address_components)

    setAddress(place.getAddress())
    onSelectPlace(place)
  }, [autoComplete, setAddress, onSelectPlace])

  useEffect(() => {
    if (!autoCompleteRef.current) {
      return
    }
    autoComplete.current = new window.google.maps.places.Autocomplete(autoCompleteRef.current, {
      fields: ['address_components'],
      types: ['address'],
    })
    autoComplete?.current?.addListener?.('place_changed', handlePlaceSelect)
  }, [handlePlaceSelect])

  return (
    <>
      <TextField
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
      />
    </>
  )
}

export default TextFieldPlaces
