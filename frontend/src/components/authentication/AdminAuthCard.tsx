import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AdminAuthCard() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return mode === "login" ? <LoginForm setMode={setMode} role="Admin"/> : <RegisterForm setMode={setMode} role="Admin"/>
}