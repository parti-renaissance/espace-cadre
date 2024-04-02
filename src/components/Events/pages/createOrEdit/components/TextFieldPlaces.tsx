import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { TextField } from '@mui/material'
import { Place } from '~/domain/place'

const messages = {
  address: 'Adresse',
}

const selectPlace = (address: google.maps.GeocoderAddressComponent[] | undefined) => {
  if (!address) {
    return Place.NULL
  }

  const number = address.find(a => a.types.includes('street_number'))?.long_name || ''
  const route = address.find(a => a.types.includes('route'))?.long_name || ''
  const postalCode = address.find(a => a.types.includes('postal_code'))?.long_name || ''
  const locality = address.find(a => a.types.includes('locality'))?.long_name || ''
  const country = address.find(a => a.types.includes('country'))?.short_name || ''

  return new Place(number, route, postalCode, locality, country)
}

type TextFieldPlacesProps = {
  onSelectPlace: (place: Place) => void
  initialValue: string
} & React.ComponentProps<typeof TextField>

const TextFieldPlaces = forwardRef<HTMLInputElement, TextFieldPlacesProps>(
  ({ onSelectPlace, initialValue, ...props }, ref) => {
    const [address, setAddress] = useState(initialValue)
    const refAutoComplete = useRef<HTMLInputElement | null>(null)
    const autoComplete = useRef<google.maps.places.Autocomplete | null>(null)

    useEffect(() => setAddress(initialValue), [initialValue])

    const handlePlaceSelect = useCallback(() => {
      const addressObject = autoComplete?.current?.getPlace()
      const place = selectPlace(addressObject?.address_components)

      setAddress(place.getAddress())
      onSelectPlace(place)
    }, [autoComplete, setAddress, onSelectPlace])

    useEffect(() => {
      const autoCompleteRef = refAutoComplete as React.MutableRefObject<HTMLInputElement | null>

      if (!autoCompleteRef.current) {
        return
      }

      autoComplete.current = new window.google.maps.places.Autocomplete(autoCompleteRef.current, {
        fields: ['address_components'],
        types: ['address'],
      })
      autoComplete?.current?.addListener?.('place_changed', handlePlaceSelect)
    }, [handlePlaceSelect, ref])

    return (
      <>
        <TextField
          {...props}
          inputRef={(node: HTMLInputElement) => {
            refAutoComplete.current = node

            if (ref) {
              if (typeof ref === 'function') {
                ref(node)
              } else {
                ref.current = node
              }
            }
          }}
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
)

TextFieldPlaces.displayName = 'TextFieldPlaces'

export default TextFieldPlaces
