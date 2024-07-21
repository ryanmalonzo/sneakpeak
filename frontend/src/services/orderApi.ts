import { CheckoutApi } from './checkoutApi'
export interface IOrder {
  order: {
    total: number
    status: string
    payment_status: string
    reference: string
    createdAt: string
    invoice_link: string
    linkPaiement: string
  }
  shipping: {
    name: string
    city: string
    street: string
    phone: string
    postal_code: string
  }
  billing: {
    name: string
    city: string
    street: string
    phone: string
    postal_code: string
  }
  products: {
    id: string
    image: string
    color: string
    size: string
    name: string
    quantity: number
    unitPrice: number
    isRefund: boolean
  }[]
}

export interface IProductReturn {
  id: number
  order_products_id: number
  reason: string
  status: string
  created_at: string
  updated_at: string
}

export class OrderApi {
  static BASE_URL = import.meta.env.VITE_API_URL

  static async loadOrder(reference: string): Promise<IOrder | undefined> {
    try {
      const response = await fetch(`${this.BASE_URL}/profile/orders/${reference}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw response as Response
      }
    } catch (error) {
      throw await (error as Response).json()
    }
  }

  static async returnProduct(productId: string, reason: string): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          reason
        })
      })

      if (!response.ok) {
        throw response as Response
      }
    } catch (error) {
      throw await (error as Response).json()
    }
  }

  static async loadProductReturn(id: number): Promise<IProductReturn | undefined> {
    try {
      const response = await fetch(`${this.BASE_URL}/return/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw response as Response
      }
    } catch (error) {
      throw await (error as Response).json()
    }
  }

  static async reOrder(reference: string): Promise<CheckoutApi.CheckoutOut> {
    try {
      const response = await fetch(`${this.BASE_URL}/checkout/reorder/${reference}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw response as Response
      }
      return await response.json()
    } catch (error) {
      throw await (error as Response).json()
    }
  }
}
