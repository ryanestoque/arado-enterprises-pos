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
import { Textarea } from "../ui/textarea";
import { useAuth } from "@/context/AuthContext";

const exchangeSchema = z.object({
  product_id: z.coerce.number<number>(),
  exchanged_quantity: z.coerce.number<number>().min(1, "Quantity is required"),
  exchange_reason: z.string().min(1, "Exchange reason cannot be blank"),
  user_id: z.coerce.number<number>(),
});

export type ExchangeFormValues = z.infer<typeof exchangeSchema>;

interface ExchangeFormProps {
  defaultValues?: Partial<ExchangeFormValues>;
  products?: { product_id: number; name: string }[];
  users?: { user_id: number; username: string }[];
  onSubmit: (values: ExchangeFormValues) => void;
  submitLabel?: string;
  isMutating?: any
  initialValues?: ExchangeFormValues,
}

export default function ExchangeForm({
  defaultValues,
  products = [],
  users = [],
  onSubmit,
  submitLabel = "Save",
  isMutating
}: ExchangeFormProps) {

  const { user } = useAuth();
  if (!user) return null;

  const form = useForm<ExchangeFormValues>({
    resolver: zodResolver(exchangeSchema),
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
          name="exchanged_quantity"
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
          name="exchange_reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for exchange</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
