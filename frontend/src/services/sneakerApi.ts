import type { VariantApi } from './variantApi'

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

  export interface PaginationOut {
    total: number
    items: SneakerOut[]
  }

  export interface PaginationVariantsIn {
    q?: string
    sort?: string
    order?: string
    page?: number
    limit?: number
    'variants.isBest'?: boolean
  }

  export interface FlattenedVariantOut {
    _id: string
    id: number
    name: string
    slug: string
    image: string
    isBest: boolean
    sizes: VariantApi.SizeOut[]
    sneakerId: string
    sneakerName: string
    sneakerDescription: string
    sneakerPrice: number
    sneakerCategory: string
    sneakerBrand: string
  }

  export interface PaginationVariantsOut {
    total: number
    items: FlattenedVariantOut[]
  }

  export const getPaginated = async (paginationIn: PaginationIn): Promise<PaginationOut> => {
    const params = new URLSearchParams()

    Object.entries(paginationIn).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString())
      }
    })

    const response = await fetch(`${BASE_URL}/sneakers?${params.toString()}`)
    const data = await response.json()
    return data
  }

  export const getVariantsPaginated = async (
    paginationIn: PaginationVariantsIn
  ): Promise<PaginationVariantsOut> => {
    const params = new URLSearchParams()

    Object.entries(paginationIn).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString())
      }
    })

    const response = await fetch(`${BASE_URL}/sneakers/variants?${params.toString()}`)
    const data = await response.json()
    return data
  }
}
