const BASE_URL = import.meta.env.VITE_API_URL

export namespace CartApi {
  export interface CartApiOut {
    id: number
    user: number
    cartProduct: CartProduct[]
    createdAt: string
    updatedAt: string
    expiredAt: string
  }

  export interface CartProduct {
    id: number
    reference: string
    name: string
    color: string
    size: string
    category: string
    brand: string
    image: string
    stock: number
    quantity: number
    unitPrice: number
    total: number
    createdAt: string
    updatedAt: string
  }

  export const getAll = async (): Promise<CartApiOut> => {
    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    const data = await response.json()
    return data
  }

  export const removeProduct = async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/cart/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
  }

  export const updateProduct = async (id: number, quantity: number): Promise<void> => {
    await fetch(`${BASE_URL}/cart`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ quantity, variantId: id })
    })
  }
}
