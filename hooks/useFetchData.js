import { useState, useEffect } from 'react'
import { server } from 'config/index'

const useDataApi = (initialEndpoint, initialValue, initialData) => {
  const [data, setData] = useState(initialData)
  const [endpoint, setEndpoint] = useState(initialEndpoint)
  const [value, setValue] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const [setErrors, setErrorHander] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    const fetchData = async () => {
      if (value) {
        setLoading(true)
        // indicates separate error handler has been passed in
        if (typeof setErrors === 'function') {
          setErrors(false)
        } else {
          setError(error)
        }
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
              if (typeof setErrors === 'function') {
                setErrors({
                  serverError: error
                })
              } else {
                setError(error)
              }
            }
          )
          .catch(catchError => {
            if (typeof setErrors === 'function') {
              setErrors({
                serverError: catchError
              })
            } else {
              setError(error)
            }
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }

    fetchData()
  }, [endpoint, value])

  return [
    { data, loading, error },
    setValue,
    setLoading,
    setData,
    setEndpoint,
    setErrorHander
  ]
}

export default useDataApi
