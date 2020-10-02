import { useState, useEffect } from 'react'
import { server } from 'config/index'

const useDataApi = (initialEndpoint, initialValue, initialData) => {
  const [data, setData] = useState(initialData)
  const [endpoint, setEndpoint] = useState(initialEndpoint)
  const [value, setValue] = useState(initialValue)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (value) {
        setError(false)
        setLoading(true)
        fetch(`${server}${endpoint}`, {
          body: JSON.stringify({ username: value }),
          method: 'POST'
        })
          .then(response => {
            if (response.status === 200) {
              return Promise.resolve(response.json()) // This will end up in SUCCESS part
            }
            return Promise.resolve(response.json()).then(responseInJson => {
              return Promise.reject(responseInJson.errorMessage) //  responseInJson.message = "Some nasty error message!"
            })
          })
          .then(
            result => {
              setData(result)
              setLoading(false)
            },
            error => {
              setError({
                serverError: error
              })
            }
          )
          .catch(catchError => {
            setError({
              serverError: catchError
            })
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }

    fetchData()
  }, [endpoint, value])

  return [
    { data, isLoading, error },
    setValue,
    setLoading,
    setData,
    setEndpoint
  ]
}

export default useDataApi
