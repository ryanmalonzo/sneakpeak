const BASE_URL = import.meta.env.VITE_API_URL

export namespace SizeApi {
  export interface SizeOut {
    id: number
    name: string
    slug: string
  }

  export const getPaginated = async (): Promise<SizeOut[]> => {
    const response = await fetch(`${BASE_URL}/sizes`)
    const data = await response.json()
    return data.items
  }
}
