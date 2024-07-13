import { CartApi } from './cartApi'
const BASE_URL = import.meta.env.VITE_API_URL

export namespace CheckoutApi {
  export interface CheckoutIn {
    billing: {
      firstName: string
      lastName: string
      address: string
      phone: string
    }
    shipping: {
      firstName: string
      lastName: string
      address: string
      phone: string
    }
  }

  export interface CheckoutOut {
    url: string
    total: number
    shipping: {
      street: string
      city: string
      state: string
      country: string
      zip: string
    }
    billing: {
      street: string
      city: string
      state: string
      country: string
      zip: string
    }
  }

  export const create = async (checkout: CheckoutIn): Promise<CheckoutOut> => {
    const data = await fetch(`${BASE_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkout),
      credentials: 'include'
    })

    if (!data.ok) {
      throw new Error(data.statusText)
    }

    return data.json()
  }

  export const getCheckoutProduct = async (): Promise<CartApi.CartApiOut> => {
    const data = await fetch(`${BASE_URL}/checkout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!data.ok) {
      throw new Error(data.statusText)
    }

    return data.json()
  }
}
