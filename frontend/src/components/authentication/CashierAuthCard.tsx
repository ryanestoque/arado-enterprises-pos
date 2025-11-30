import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function CashierAuthCard() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return mode === "login" ? <LoginForm setMode={setMode} role="Cashier"/> : <RegisterForm setMode={setMode} role="Cashier"/>
}