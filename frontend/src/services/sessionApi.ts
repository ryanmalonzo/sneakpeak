// Appel Api

import { getToken, removeToken, saveToken } from '@/helpers/token'

export class SessionApi {
  static BASE_URL = 'http://localhost:3000'

  static async register(email: string, password: string) {
    try {
      const response = await fetch(`${this.BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
      })
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error('Error register:', error)
    }
  }

  static async login(email: string, password: string) {
    try {
      const response = await fetch(`${this.BASE_URL}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
      })
      const data = await response.json()

      if (data.token) {
        console.log(getToken())
        saveToken(data.token)
      }
      return data
    } catch (error) {
      console.error('Error login:', error)
    }
  }

  static logout() {
    removeToken()
  }

  static async checkSession() {
    try {
      const response = await fetch(`${this.BASE_URL}/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: getToken() })
      })
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error('Error check:', error)
    }
  }

  static isConnected() {
    const token = getToken()

    if (token === 'undefined' || token === 'null') {
      console.log('Token is undefined or null')
      return false
    }

    if (token === '') {
      console.log('Token is an empty string')
      return false
    }

    return true
  }
}
