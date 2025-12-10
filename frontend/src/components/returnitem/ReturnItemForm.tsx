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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { useAuth } from "@/context/AuthContext";

const returnItemSchema = z.object({
  product_id: z.coerce.number<number>(),
  return_quantity: z.coerce.number<number>().min(1, "Quantity is required"),
  return_reason: z.string().min(1, "Return reason cannot be blank"),
  user_id: z.coerce.number<number>(),
  status: z.string().min(1, "Status is required"),
});

export type ReturnItemFormValues = z.infer<typeof returnItemSchema>;

interface ReturnItemFormProps {
  defaultValues?: Partial<ReturnItemFormValues>;
  products?: { product_id: number; name: string }[];
  users?: { user_id: number; username: string }[];
  onSubmit: (values: ReturnItemFormValues) => void;
  submitLabel?: string;
  isMutating?: any
  initialValues?: ReturnItemFormValues,
}

export default function ReturnForm({
  defaultValues,
  products = [],
  users = [],
  onSubmit,
  submitLabel = "Save",
  isMutating
}: ReturnItemFormProps) {

  const { user } = useAuth();
  if (!user) return null;

  const form = useForm<ReturnItemFormValues>({
    resolver: zodResolver(returnItemSchema),
    defaultValues: {
      ...defaultValues,
      user_id: user.user_id,
    },
  });

  
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);


  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="product_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value?.toString()}
                  >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                    <SelectItem key={p.product_id} value={String(p.product_id)}>
                    {p.name}
                    </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <FormControl>
                <Select
                  disabled 
                  onValueChange={(val) => field.onChange(Number(val))}
                  defaultValue={user.user_id.toString()}
                  >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      key={user.user_id} 
                      value={String(user.user_id)}>
                      {user.username}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="return_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="return_reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for return</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Active or Inactive" />
                </SelectTrigger>
              </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="Unreviewed">Subject for review</SelectItem>
                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
