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

interface Payment {
  payment_id: string
  date: string,
  original_total: number,
  discount_amount: number,
  total_amount: number,
  status: string,
  cashier_name: string,
  user_id: number
}

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
  return res.json()
}

const CATEGORY_URL = "http://localhost:5000/api/category"
const PRODUCT_URL = "http://localhost:5000/api/product"
const PAYMENT_URL = "http://localhost:5000/api/payment"

export function useProduct() {
  return useSWR<Product[]>(PRODUCT_URL, fetcher)
}

export function useCategory() {
  return useSWR<Category[]>(CATEGORY_URL, fetcher)
}

export function usePayment() {
  return useSWR<Payment[]>(PAYMENT_URL, fetcher)
}