import { useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  contact_person: z.string().min(1, "Contact person is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  email: z.email({
    message: "Email is invalid."
  }),
  address: z.string().default("").optional(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  defaultValues?: Partial<SupplierFormValues>;
  onSubmit: (values: SupplierFormValues) => void;
  submitLabel?: string;
  isMutating?: any
  initialValues?: SupplierFormValues,
}

export default function SupplierForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save",
  isMutating
}: SupplierFormProps) {

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier name</FormLabel>
              <FormControl>
                <Input 
                  autoFocus {...field}
                  autoComplete="off"
                  placeholder="e.g. Stark Industries" 
                  {...field}
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact_person"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact person</FormLabel>
              <FormControl>
                <Input 
                  autoComplete="off"
                  placeholder="e.g. Tony Stark" 
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input 
                  autoComplete="off"
                  placeholder="e.g. 09123456789" 
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  autoComplete="off"
                  placeholder="someone@example.com" 
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input 
                  autoComplete="off"
                  placeholder="Manhattan, New York City" 
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
     
        <Button 
          disabled={isMutating}
          type="submit">{submitLabel}</Button>
      </form>
    </Form>
  );
}
