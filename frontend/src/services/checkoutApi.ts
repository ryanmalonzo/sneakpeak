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

  export const create = async (checkout: CheckoutIn): Promise<void> => {
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
}
