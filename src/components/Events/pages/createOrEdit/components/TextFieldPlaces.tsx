import { useCallback, useEffect, useRef, useState, forwardRef } from 'react'
import { useForwardRef } from '~/hooks/useForwardRef'
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
} & React.ComponentProps<typeof TextField>

const TextFieldPlaces = forwardRef<HTMLInputElement, TextFieldPlacesProps>(({ onSelectPlace, ...props }, myRef) => {
  const autoCompleteRef = useForwardRef<HTMLInputElement>(myRef)
  const autoComplete = useRef<google.maps.places.Autocomplete | null>(null)

  const handlePlaceSelect = useCallback(() => {
    const addressObject = autoComplete?.current?.getPlace()
    const place = selectPlace(addressObject?.address_components)
    onSelectPlace(place)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!autoCompleteRef.current) {
      return
    }
    autoComplete.current = new window.google.maps.places.Autocomplete(autoCompleteRef.current, {
      fields: ['address_components'],
      types: ['address'],
    })
    autoComplete?.current?.addListener?.('place_changed', handlePlaceSelect)
  }, [autoCompleteRef, handlePlaceSelect])

  return (
    <TextField
      {...props}
      inputRef={autoCompleteRef}
      fullWidth
      size="medium"
      id="adress"
      name="address"
      inputProps={{ maxLength: 500 }}
      placeholder={messages.address}
    />
  )
})

TextFieldPlaces.displayName = 'TextFieldPlaces'

export default TextFieldPlaces
