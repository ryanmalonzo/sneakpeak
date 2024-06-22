const BASE_URL = import.meta.env.VITE_API_URL

export namespace VariantApi {
  export interface PaginationIn {
    q?: string
    sort?: string
    order?: string
    page?: number
    limit?: number
    color?: string
    size?: string
    price?: string
    stock?: string
    isBest?: boolean
  }

  export interface VariantOut {
    _id: string
    id: number
    name: string
    price: number
    stock: number
    image: string
  }

  export interface PaginationOut {
    total: number
    items: VariantOut[]
  }

  export const getPaginated = async (paginationIn: PaginationIn): Promise<PaginationOut> => {
    const params = new URLSearchParams()

    Object.entries(paginationIn).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString())
      }
    })

    const response = await fetch(`${BASE_URL}/variants?${params.toString()}`)
    const data = await response.json()
    return data
  }
}
