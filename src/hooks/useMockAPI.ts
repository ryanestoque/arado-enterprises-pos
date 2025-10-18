import useSWR from 'swr';

interface Product {
  product_id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  sku: string
  category_id: string
}

interface Category {
  category_id: string
  name: string
}

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
  return res.json()
}

const CATEGORIES_URL = "https://68f379bdfd14a9fcc428e503.mockapi.io/api/categories"
const PRODUCTS_URL = "https://68f379bdfd14a9fcc428e503.mockapi.io/api/products"

export function useProducts() {
  return useSWR<Product[]>(PRODUCTS_URL, fetcher)
}

export function useCategories() {
  return useSWR<Category[]>(CATEGORIES_URL, fetcher)
}