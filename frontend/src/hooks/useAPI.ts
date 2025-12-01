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
  payment_id: number
  date: string
  original_total: number
  discount_amount: number
  discount_reason: string
  total_amount: number
  username: string
  user_id: number
  amount_given: number
  change_amount: number
  payment_method: string
}

interface PaymentItem {
  product_id: number;
  product_name: string;
  item_quantity: number;
  item_price: number;
}

interface JoinedPayment extends Payment {
  username: string;
  first_name: string;
  last_name: string;
  items: PaymentItem[]; // To hold the items for this payment
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
  user_id: number
  username:  string
  password: string
  role: string
  first_name: string
  last_name: string
}

interface Stockin {
  stockin_id: number
  date: string
  product_id: number
  quantity: number
  supplier_id: number
  user_id: number
  product_name: string
  supplier_name: string
  username: string
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
const STOCKIN_URL = "http://localhost:5000/api/stockin"

export function useProduct() {
  return useSWR<Product[]>(PRODUCT_URL, fetcher)
}

export function useCategory() {
  return useSWR<Category[]>(CATEGORY_URL, fetcher)
}

export function usePayment() {
  return useSWR<Payment[]>(PAYMENT_URL, fetcher)
}

export function usePaymentById(paymentId: number | null) {
  const url = paymentId ? `${PAYMENT_URL}/${paymentId}` : null;
  
  return useSWR<JoinedPayment>(url, fetcher); 
}

export function useSupplier() {
  return useSWR<Supplier[]>(SUPPLIER_URL, fetcher)
}

export function useUser() {
  return useSWR<User[]>(USER_URL, fetcher)
}

export function useStockin() {
  return useSWR<Stockin[]>(STOCKIN_URL, fetcher)
}