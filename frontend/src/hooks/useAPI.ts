import useSWR from 'swr';

interface Product {
  product_id: number
  name: string
  description: string
  category_id: number
  supplier_id: number
  price: number
  stock_quantity: number
  reorder_level: number
  sku: string
  barcode: string
  category_name: string
  supplier_name: string
}

interface Category {
  category_id: number
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
  amount_given: number
  change_amount: number
}

interface Supplier {
  supplier_id: number
  name: string
  contact_person: string
  phone: string
  email: string
  address: string
}

interface User {
  username:  string
  password: string
  role: string
  first_name: string
  last_name: string
}

const fetcher = async <T>(url: string): Promise<T> => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
  return res.json()
};

const CATEGORY_URL = "http://localhost:5000/api/category"
const PRODUCT_URL = "http://localhost:5000/api/product"
const PAYMENT_URL = "http://localhost:5000/api/payment"
const SUPPLIER_URL = "http://localhost:5000/api/supplier"
const USER_URL = "http://localhost:5000/api/user"

export function useProduct() {
  return useSWR<Product[]>(PRODUCT_URL, fetcher)
}

export function useCategory() {
  return useSWR<Category[]>(CATEGORY_URL, fetcher)
}

export function usePayment() {
  return useSWR<Payment[]>(PAYMENT_URL, fetcher)
}

export function useSupplier() {
  return useSWR<Supplier[]>(SUPPLIER_URL, fetcher)
}

export function useUser() {
  return useSWR<User[]>(USER_URL, fetcher)
}