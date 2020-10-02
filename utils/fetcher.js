import { server } from 'config/index'

const fetcher = async (url, value) => {
  return fetch(`${server}${url}`, {
    body: JSON.stringify({ username: value }),
    method: 'POST'
  }).then(r => r.json())
}

const basicFetcher = url => fetch(`${server}${url}`).then(r => r.json())
/*
  console.log(props)
  let [endpoint, value] = props
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
        return result
      },
      error => {
        return error
      }
    )
    .catch(catchError => {
      return catchError
    })
}*/

export { fetcher, basicFetcher }
