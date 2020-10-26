import { server } from 'config/index'

const fetcher = async (url, value) => {
  return fetch(`${server}${url}`, {
    body: JSON.stringify({ username: value }),
    method: 'POST'
  }).then(r => r.json())
}

const basicFetcher = url => fetch(`${server}${url}`).then(r => r.json())

export { fetcher, basicFetcher }
