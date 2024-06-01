const BASE_URL = import.meta.env.VITE_API_URL

export namespace SneakerApi {
  export interface PaginationIn {
    q: string
    page?: number
    limit?: number
  }

  export interface PaginationOut {
    total: number
    items: SneakerOut[]
  }

  export interface SneakerOut {
    _id: string
    coverImage: string
    name: string
    price: number
  }

  export const getPaginated = async ({
    q,
    page = 1,
    limit = 25
  }: PaginationIn): Promise<PaginationOut> => {
    const response = await fetch(`${BASE_URL}/sneakers?q=${q}&page=${page}&limit=${limit}`)
    const data = await response.json()
    return data
  }
}
