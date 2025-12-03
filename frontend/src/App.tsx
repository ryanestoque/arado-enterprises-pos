import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Authentication from "@/pages/Authentication/Authentication";
import Dashboard from "@/pages/Dashboard/Dashboard";
import POS from "@/pages/Sales/POS";
import Products from "./pages/Inventory/Products";
import Categories from "./pages/Inventory/Categories";
import Suppliers from "./pages/Suppliers/Suppliers";
import Settings from "./pages/Settings/Settings";
import Users from "./pages/Users/Users";
import Exchange from "./pages/Sales/Exchange";
import AuditLogs from "./pages/AuditLogs/AuditLogs";

export default function App() {
  return(
    <Routes>
      <Route path="/" element={<Authentication />}/>

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} /> 
        <Route path="pos" element={<POS />} /> 
        <Route path="exchange" element={<Exchange />} /> 
        <Route path="categories" element={<Categories />} /> 
        <Route path="products" element={<Products />} /> 
        <Route path="suppliers" element={<Suppliers />} /> 
        <Route path="auditlog" element={<AuditLogs />} /> 
        <Route path="users" element={<Users />} /> 
        <Route path="settings" element={<Settings />} /> 
      </Route>
    </Routes>
  )
}