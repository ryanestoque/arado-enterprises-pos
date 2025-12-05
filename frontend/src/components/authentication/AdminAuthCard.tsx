import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AdminAuthCard({role} : any) {
  const [mode, setMode] = useState<"login" | "register">("login");

  return mode === "login" ? <LoginForm setMode={setMode} role={role}/> : <RegisterForm setMode={setMode} role={role}/>
}