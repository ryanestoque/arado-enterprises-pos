import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Authentication from "@/pages/Authentication/Authentication";
import Dashboard from "@/pages/Dashboard/Dashboard";
import POS from "@/pages/Sales/POS";
import Returns from "./pages/Sales/Returns";

export default function App() {
  return(
    <Routes>
      <Route path="/" element={<Authentication />}/>

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} /> 
        <Route path="pos" element={<POS />} /> 
        <Route path="returns" element={<Returns />} /> 
      </Route>
    </Routes>
  )
}