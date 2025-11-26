import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Authentication from "@/pages/Authentication/Authentication";
import Dashboard from "@/pages/Dashboard/Dashboard";
import POS from "@/pages/Sales/POS";
import Returns from "./pages/Sales/Returns";
import Products from "./pages/Inventory/Products";
import Categories from "./pages/Inventory/Categories";
import Suppliers from "./pages/Suppliers/Suppliers";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import Users from "./pages/Users/Users";

export default function App() {
  return(
    <Routes>
      <Route path="/" element={<Authentication />}/>

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} /> 
        <Route path="pos" element={<POS />} /> 
        <Route path="returns" element={<Returns />} /> 
        <Route path="categories" element={<Categories />} /> 
        <Route path="products" element={<Products />} /> 
        <Route path="suppliers" element={<Suppliers />} /> 
        <Route path="reports" element={<Reports />} /> 
        <Route path="users" element={<Users />} /> 
        <Route path="settings" element={<Settings />} /> 
      </Route>
    </Routes>
  )
}