const BASE_URL = import.meta.env.VITE_API_URL

export namespace CategoryApi {
  export interface CategoryOut {
    name: string
    slug: string
  }

  export const getAll = async (): Promise<CategoryOut[]> => {
    const response = await fetch(`${BASE_URL}/categories`)
    const data = await response.json()
    return data
  }
}
