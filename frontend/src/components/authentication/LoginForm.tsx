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

interface LoginFormProps {
  setMode: (m: "login" | "register") => void;
  role: string;
}

const loginSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(25, {
    message: "Up to 25 characters only.",
  }),

  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),

  role: z.string(),
})

async function authPost(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Authentication failed.')
  return res.json()
}

export default function LoginForm({ setMode, role }: LoginFormProps) {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues:  { username: "", password: "", role: role }
  });

  const { trigger: loginTrigger, isMutating: isLoggingIn } = useSWRMutation("http://localhost:5000/api/auth/login", authPost)

  const { login } = useAuth();

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      const res = await loginTrigger(values);
      console.log("Logged in:", res)
      // localStorage.setItem("token", res.token);
      // localStorage.setItem("role", res.role);

    if (res.user.role !== role) {
      throw new Error("Role mismatch");
    }

      login(res.user, res.token);
      return true;
    } catch (err) {
      console.error(err)
      return false;
    }
  }

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {{
    const success = await handleLogin(values);

    if (success) {
      toast({
        title: "Logged in successfully!",
      });
      navigate("/app/dashboard");
    } else {
      toast({
        title: "Invalid credentials",
        variant: "destructive"
      });
    }
  }};
  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              {role === "Admin" ? "Admin Login" : "Cashier Login"}
            </CardTitle>
            <CardDescription>
              Arado Enterprises
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Button 
                      variant="link"
                      className="p-0 font-normal text-xs"
                      type="button"
                      >
                      Forgot password?
                    </Button> 
                  </div>
                  <FormControl>
                    <Input
                     
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox id="remember"/>
                    <label
                      htmlFor="remember"
                      className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Stay logged in
                    </label>
                  </div>
                </FormItem>
              )}
            />         
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button    
              type="submit"      
              className="w-full"
              >
              Log in
            </Button>
            {/* <Button 
              type="button"
              onClick={() => {
                form.reset();
                setMode("register")
              }}
              variant="link" 
              className="p-0 w-full">
              Create account
            </Button> */}
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

