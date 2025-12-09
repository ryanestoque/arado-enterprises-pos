import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import useSWRMutation from "swr/mutation";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { API_BASE } from "@/hooks/useAPI";

interface RegisterFormProps {
  setMode: (m: "login" | "register") => void;
  role: string;
}

const registerSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(25, {
    message: "Up to 25 characters only.",
  }),

  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),

  role: z.string(),

  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),

  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
})

async function authPost(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Authentication failed.')
  return res.json()
}

export default function RegisterForm({ setMode, role }: RegisterFormProps) {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "", role: role, first_name: "", last_name: "" }
  });

  const { trigger: registerTrigger, isMutating: isRegistering } = useSWRMutation(`${API_BASE}/api/auth/auth/register`, authPost)

  const { login } = useAuth();

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    try {
      console.log(values)
      const res = await registerTrigger(values)
      console.log("Logged in:", res)
      // localStorage.setItem("token", data.token);
      // localStorage.setItem("role", data.role);

      login(res.user, res.token);
      return true;
    } catch (err) {
      console.error(err)
      return false;
    }
  }

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    const ok = await handleRegister(values);

    if (ok) {
      console.log("success")
      navigate("/app/dashboard"); // redirect
      toast({ title: "Account created!" })
    }
  };

  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              {role === "Admin" ? "Admin Registration" : "Cashier Registration"}
            </CardTitle>
            <CardDescription>
              Arado Enterprises
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                       
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />  
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                     
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <div className="flex items-center gap-2 pt-2">
                    <Checkbox id="remember"/>
                    <label
                      htmlFor="remember"
                      className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Stay logged in
                    </label>
                  </div> */}
                </FormItem>
              )}
            />         
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button    
              type="submit"      
              className="w-full"
              >
              Register
            </Button>
            {/* <Button 
              type="button"
              onClick={() => {
                form.reset();
                setMode("login")
              }}
              variant="link" 
              className="p-0 w-full">
              Back to login
            </Button> */}
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}