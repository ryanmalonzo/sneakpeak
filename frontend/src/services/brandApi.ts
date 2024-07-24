const BASE_URL = import.meta.env.VITE_API_URL

export namespace BrandApi {
  export interface PaginationIn {
    q?: string
    sort?: string
    order?: string
    page?: number
    limit?: number
  }

  export interface BrandOut {
    id: number
    name: string
    slug: string
    image: string
  }

  export const getPaginated = async (paginationIn: PaginationIn = {}): Promise<BrandOut[]> => {
    const params = new URLSearchParams()

    Object.entries(paginationIn).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString())
      }
    })

    const response = await fetch(`${BASE_URL}/brands?${params.toString()}`)
    const data = await response.json()
    return data.items
  }
}
