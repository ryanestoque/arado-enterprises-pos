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
  image_url: string
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
  items: PaymentItem[];
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
  status: string
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

interface ReturnItem {
  return_id: number
  product_id: number
  product_name: string
  ereturn_quantity: number
  return_date: string
  return_reason: string
  user_id: number
  username: string
}

interface AuditLogs {
  audit_id: number
  user_id: number
  username?: string
  product_name?: string
  module: string
  action: string
  description?: string
  before_data: JSON
  after_data: JSON
  ip_address: string
  created_at: string
}

interface TotalRevenueResponse {
  totalRevenue: number;
}

interface TotalQuantityResponse {
  totalQuantity: number;
}

interface TotalInventoryValueResponse {
  totalInventoryValue: number;
}

interface BestSellingProduct {
  product_id: number;
  name: string;
  total_sold: number;
}

interface GrossProfitResponse {
  total_revenue: number;
  total_cogs: number;
  gross_profit: number;
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

// const CATEGORY_URL = "http://localhost:5000/api/category"
// const PRODUCT_URL = "http://localhost:5000/api/product"
// const PAYMENT_URL = "http://localhost:5000/api/payment"
// const SUPPLIER_URL = "http://localhost:5000/api/supplier"
// const USER_URL = "http://localhost:5000/api/user"
// const STOCKIN_URL = "http://localhost:5000/api/stockin"
// const RETURNITEM_URL = "http://localhost:5000/api/return"
// const AUDITLOGS_URL = "http://localhost:5000/api/auditlog"

const CATEGORY_URL = "http://localhost:5000/api/category"
const PRODUCT_URL = "http://localhost:5000/api/product"
const PAYMENT_URL = "http://localhost:5000/api/payment"
const SUPPLIER_URL = "http://localhost:5000/api/supplier"
const USER_URL = "http://localhost:5000/api/user"
const STOCKIN_URL = "http://localhost:5000/api/stockin"
const RETURNITEM_URL = "http://localhost:5000/api/return"
const AUDITLOGS_URL = "http://localhost:5000/api/auditlog"

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

export function useTotalRevenue() {
  const url = `${PAYMENT_URL}/total_revenue`;
  
  return useSWR<TotalRevenueResponse>(url, fetcher); 
}

export function useTotalQuantity() {
  const url = `${PRODUCT_URL}/total_quantity`;
  
  return useSWR<TotalQuantityResponse>(url, fetcher); 
}

export function useTotalInventoryValue() {
  const url = `${PRODUCT_URL}/total_inventory_value`;
  
  return useSWR<TotalInventoryValueResponse>(url, fetcher); 
}

export function useBestSeller() {
  const url = `${PAYMENT_URL}/best_selling`;
  
  return useSWR<BestSellingProduct>(url, fetcher); 
}

export function useGrossProfit() {
  const url = `${PAYMENT_URL}/gross_profit`;
  
  return useSWR<GrossProfitResponse>(url, fetcher); 
}

export function useSupplier() {
  return useSWR<Supplier[]>(SUPPLIER_URL, fetcher)
}

export function useUser() {
  return useSWR<User[]>(USER_URL, fetcher)
}

export function useUserById(userId: number | null) {
  return useSWR<User>(userId ? `${USER_URL}/${userId}` : null, fetcher)
}

export function useStockin() {
  return useSWR<Stockin[]>(STOCKIN_URL, fetcher)
}

export function useReturnItem() {
  return useSWR<ReturnItem[]>(RETURNITEM_URL, fetcher)
}

export function useAuditLogs() {
  return useSWR<AuditLogs[]>(AUDITLOGS_URL, fetcher)
}