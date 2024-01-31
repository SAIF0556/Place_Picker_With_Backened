import { useEffect, useState } from 'react'
import Places from './Places.jsx'
import Error from './Error.jsx'
import { sortPlacesByDistance } from '../loc.js'
import { fetchAvailablePlaces } from '../http.js'
export default function AvailablePlaces({ onSelectPlace }) {
  // Todo : Fetch  available places from backened API
  const [AvailablePlaces, setAvailablePlaces] = useState([])
  const [isFetching, setIsFetching] = useState('false')
  const [error, setError] = useState()
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true)

      try {
        const places = await fetchAvailablePlaces()

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude,
          )
          setAvailablePlaces(sortedPlaces)
          setIsFetching(false)
        })
      } catch (error) {
        setError({
          message:
            error.message || 'Could not fetch places, please try again later',
        })
        setIsFetching(false)
      }
    }

    fetchPlaces()
  }, [])

  if (error) {
    return <Error message={error.message} title="An error occured" />
  }

  return (
    <Places
      title="Available Places"
      isLoading={isFetching}
      isLoadingText="The data is loading"
      places={AvailablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  )
}
