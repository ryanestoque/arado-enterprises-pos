import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Checkbox } from "../ui/checkbox";

const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),

  email: z.email({
    message: "Email is invalid."
  }),

  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(25, {
    message: "Up to 25 characters only.",
  }),

  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export default function AdminAuthCard() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "login" ? "Admin Login" : "Admin Registration"}
            </CardTitle>
            <CardDescription>
              Arado Enterprises
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {mode === "register" ?
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> : ""}
            {mode === "register" ?
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                       
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> : ""}
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
                  {mode === "login" ?
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
                  : <FormLabel>Password</FormLabel>}
                  <FormControl>
                    <Input
                     
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {mode === "login" ?
                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox id="remember"/>
                    <label
                      htmlFor="remember"
                      className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Stay logged in
                    </label>
                  </div>
                  : ""}
                </FormItem>
              )}
            />         
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button    
              type="submit"      
              className="w-full">
              {mode === "login" ? "Log in" : "Register"}
            </Button>
            <Button 
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                form.reset();
              }}
              variant="link" 
              className="p-0 w-full">
              {mode === "login" ? "Create account" : "Back to login"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}