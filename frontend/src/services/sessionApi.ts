import { handleError } from "@/helpers/error"

export class SessionApi {
  static BASE_URL = import.meta.env.VITE_API_URL

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
        body: JSON.stringify({ email: email, password: password }),
        credentials: 'include'
      })

      if (response.ok) {
        return
      } else {
        throw response as Response
      }
      
    } catch (error) {
      handleError(error as Response)
      throw await (error as Response).json() // Renvoie le message d'erreur au composant
    }
  }

  static logout() {
    // TODO remove cookie token
  }

  static async checkSession() {
    try {
      const response = await fetch(`${this.BASE_URL}/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error('Error check:', error)
    }
  }
}
