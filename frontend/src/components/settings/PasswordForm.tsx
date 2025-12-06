import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),

  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),

  confirmPassword: z.string().min(1, "Please confirm your password"),
})
.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordFormProps {
  defaultValues?: Partial<PasswordFormValues>;
  onSubmit: (values: PasswordFormValues) => void;
  submitLabel?: string;
  isMutating?: any
  initialValues?: PasswordFormValues,
}

export default function PasswordForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save",
  isMutating
}: PasswordFormProps) {


  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    placeholder="Enter current password"
                    {...field}
                    className="pr-10"
                  />

                  <Button
                    type="button"
                    variant="link"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="off"
                  placeholder="Must contain A-Z, a-z, 0-9, and a symbol."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="off"
                  placeholder="Re-enter new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          disabled={!form.formState.isDirty || isMutating}
          type="submit">{submitLabel}</Button>
      </form>
    </Form>
  );
}
