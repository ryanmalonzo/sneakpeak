const BASE_URL = import.meta.env.VITE_API_URL

export namespace ColorApi {
  export interface ColorOut {
    id: number
    name: string
    slug: string
    hexCode: string
  }

  export const getPaginated = async (): Promise<ColorOut[]> => {
    const response = await fetch(`${BASE_URL}/colors`)
    const data = await response.json()
    return data.items
  }
}
