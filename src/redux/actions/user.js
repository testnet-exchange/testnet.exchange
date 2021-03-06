import reducer from '../core/reducers'
import axios from 'axios'

import { getState } from '../core'

import { API_ROOT } from './api'

const getAuthHeaders = (access_token) => ({
  Authorization: `Bearer ${access_token}`
})

const auth = (name, password) => {
  const url = `${API_ROOT}/auth`

  axios.post(url, '', {
    headers: {
      Authorization: `Basic ${btoa(`${name}:${password}`)}`,
    }
  })
    .then(({ data }) => {
      const { token } = data
      localStorage.setItem('access_token', token)
      reducer.user.setAuth({ data })
    })
}

const setUser = (id) => {
  const url = `${API_ROOT}/users/${id}`
  axios.get(url)
    .then(result => console.log(result))
}

const sign = (name, password) => {
  const url = `${API_ROOT}/users/sign-up`

  axios.post(url, { "email": name, "password": password })
    .then(({ data }) => {
      const { token } = data
      localStorage.setItem('access_token', token)
      reducer.user.setAuth({ data })
    })
}

const getUser = () => {
  const token = localStorage.getItem('access_token')

  localStorage.setItem('access_token', token)
  reducer.user.setAuth({ data: { token }})
}

const getMe = (access_token) => {
  const headers = getAuthHeaders(access_token)

  axios.get(`${API_ROOT}/users/me`, { headers })
    .then(({ data: user }) => {
      reducer.user.setUser({ data: { user } })
    })
}

const fetchAddress = async () => {
  const { token: access_token } = getState().user

  const headers = getAuthHeaders(access_token)

  const { data } = await axios(`${API_ROOT}/deposit/get-address`, { headers })

  const { error, result } = data

  if (error) {
    console.error(error)
  } else {
    reducer.user.setDepositAddress({ data: { address: result }})
  }
}

export default {
  auth,
  sign,
  getMe,
  setUser,
  getUser,
  fetchAddress,
}
