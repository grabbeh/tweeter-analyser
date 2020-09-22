import { useState, useEffect } from 'react'
import { server } from 'config/index'

const useDataApi = (initialEndpoint, initialValue, initialData) => {
  const [data, setData] = useState(initialData)
  const [endpoint, setEndpoint] = useState(initialEndpoint)
  const [value, setValue] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)
      try {
        if (value) {
          await fetch(`${server}${endpoint}`, {
            body: JSON.stringify({ username: value }),
            method: 'POST'
          })
            .then(r => r.json())
            .then(result => setData(result))
        }
      } catch (error) {
        setIsError(true)
      }
      setIsLoading(false)
    }

    fetchData()
  }, [endpoint, value])

  return [
    { data, isLoading, isError },
    setEndpoint,
    setValue,
    setData,
    setIsLoading
  ]
}

export default useDataApi
