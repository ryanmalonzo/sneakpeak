const BASE_URL = import.meta.env.VITE_API_URL

export namespace SneakerApi {
  export interface PaginationIn {
    q?: string
    sort?: string
    order?: string
    page?: number
    limit?: number
    brand?: string
    category?: string
    price?: string
  }

  export interface PaginationOut {
    total: number
    items: SneakerOut[]
  }

  export interface VariantOut {
    _id: string
    stock: number
    image: string
    size: number
    color: string
  }

  export interface SneakerOut {
    _id: string
    name: string
    price: number
    variants: VariantOut[]
  }

  export const getPaginated = async ({
    q,
    sort,
    order,
    page,
    limit,
    brand,
    category,
    price
  }: PaginationIn): Promise<PaginationOut> => {
    const params = new URLSearchParams()

    if (q) params.append('q', q)
    if (sort) params.append('sort', sort)
    if (order) params.append('order', order)
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    if (brand) params.append('brand', brand)
    if (category) params.append('category', category)
    if (price) params.append('price', price)

    const response = await fetch(`${BASE_URL}/sneakers?${params.toString()}`)
    const data = await response.json()
    return data
  }
}
