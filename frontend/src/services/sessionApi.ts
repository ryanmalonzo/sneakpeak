import { handleError } from '@/helpers/error'

export interface IProfile {
  id: number
  email: string
  firstName: string
  lastName: string
  password: string
  phone: string
  roles: string[]
  createdAt: string
  updatedAt: string
}

export class SessionApi {
  static BASE_URL = import.meta.env.VITE_API_URL

  static async register(email: string, password: string) {
    try {
      await fetch(`${this.BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
      })
    } catch (error) {
      console.error(error)
    }
  }

  static async login(email: string, password: string): Promise<void> {
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

  static async logout() {
    try {
      const response = await fetch(`${this.BASE_URL}/session/logout`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
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

  static async getProfile(): Promise<IProfile> {
    try {
      const response = await fetch(`${this.BASE_URL}/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        return data.user as IProfile
      } else {
        throw response as Response
      }
    } catch (error) {
      throw await (error as Response).json() // Renvoie le message d'erreur au composant
    }
  }
}
