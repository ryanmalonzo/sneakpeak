const BASE_URL = import.meta.env.VITE_API_URL

export namespace CategoryApi {
  export interface CategoryOut {
    id: number
    name: string
    slug: string
    image: string
  }

  export const getPaginated = async (): Promise<CategoryOut[]> => {
    const response = await fetch(`${BASE_URL}/categories`)
    const data = await response.json()
    return data.items
  }
}
