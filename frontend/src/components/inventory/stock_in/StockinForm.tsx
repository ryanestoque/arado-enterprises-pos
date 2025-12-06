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
import { useAuth } from "@/context/AuthContext";

const stockinSchema = z.object({
  product_id: z.coerce.number<number>(),
  quantity: z.coerce.number<number>().min(1, "Quantity is required"),
  supplier_id: z.coerce.number<number>(),
  user_id: z.coerce.number<number>(),
});

export type StockinFormValues = z.infer<typeof stockinSchema>;

interface StockinFormProps {
  defaultValues?: Partial<StockinFormValues>;
  products?: { product_id: number; name: string, supplier_id: number, supplier_name: string }[];
  suppliers?: { supplier_id: number; name: string }[];
  users?: { user_id: number; username: string }[];
  onSubmit: (values: StockinFormValues) => void;
  submitLabel?: string;
  isMutating?: any
  initialValues?: StockinFormValues,
}

export default function StockinForm({
  defaultValues,
  products = [],
  suppliers = [],
  users = [],
  onSubmit,
  submitLabel = "Save",
  isMutating
}: StockinFormProps) {
  const { user } = useAuth();
  if (!user) return null;

  const form = useForm<StockinFormValues>({
    resolver: zodResolver(stockinSchema),
      defaultValues: {
      ...defaultValues,
      user_id: user.user_id,
    },
  });

  const selectedProductId = form.watch("product_id");

  useEffect(() => {
    if (!selectedProductId) return;

    const selectedProduct = products.find(
      (p) => p.product_id === Number(selectedProductId)
    );

    if (selectedProduct) {
      form.setValue("supplier_id", selectedProduct.supplier_id);
    }
  }, [selectedProductId, products, form]);

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
          name="supplier_id"
          render={({ field }) => {
            const selectedProduct = products.find(
              (p) => p.product_id === Number(form.watch("product_id"))
            );

            return (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    value={selectedProduct?.supplier_name || ""}
                  />
                </FormControl>
              </FormItem>
            );
          }}
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
          name="quantity"
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
        <Button 
          disabled={isMutating}
          type="submit">{submitLabel}</Button>
      </form>
    </Form>
  );
}
