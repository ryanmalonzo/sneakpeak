export class SneakerApi {
  static BASE_URL = import.meta.env.VITE_API_URL

  static async get(q: string): Promise<any> {
    const response = await fetch(`${this.BASE_URL}/sneakers?q=${q}`)
    const data = await response.json()
    return data
  }
}
