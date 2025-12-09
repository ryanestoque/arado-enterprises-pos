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

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().default("").optional(),
  category_id: z.coerce.number<number>(),
  supplier_id: z.coerce.number<number>(),
  price: z.coerce.number<number>().min(1, "Price is required"),
  cost: z.coerce.number<number>().min(1, "Cost is required"),
  stock_quantity: z.coerce.number<number>().min(0, "Stock quantity is required"),
  reorder_level: z.coerce.number<number>().optional(),
  barcode: z.string().default("").optional(),
  sku: z.string().min(1, "SKU is required"),
  image_url: z
    .any()
    .optional(), // this will hold the File object from input
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  categories?: { category_id: number; name: string }[];
  suppliers?: { supplier_id: number; name: string }[];
  onSubmit: (values: ProductFormValues) => void;
  submitLabel?: string;
  isMutating?: any
  initialValues?: ProductFormValues,
}

export default function ProductForm({
  defaultValues,
  categories = [],
  suppliers = [],
  onSubmit,
  submitLabel = "Save",
  isMutating
}: ProductFormProps) {

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
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
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              {field.value && (
                <img
                  src={
                    field.value instanceof File
                      ? URL.createObjectURL(field.value) // local file preview
                      : field.value                        // existing URL from server
                  }
                  alt="Preview"
                  className="aspect-square object-cover rounded-md"
                />
              )}
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("upload_preset", "products_preset"); // unsigned preset
                    formData.append("folder", "products"); // optional folder

                    const res = await fetch(
                      `https://api.cloudinary.com/v1_1/da1ewqsie/image/upload`,
                      {
                        method: "POST",
                        body: formData,
                      }
                    );
                    const data = await res.json();
                    field.onChange(data.secure_url);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product name</FormLabel>
              <FormControl>
                <Input 
                  autoFocus {...field}
                  autoComplete="off"
                  placeholder="e.g. Hammer" 
                  {...field}
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input 
                  autoComplete="off"
                  placeholder="Add a short description..." 
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value?.toString()}
                  >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                    <SelectItem key={c.category_id} value={String(c.category_id)}>
                    {c.name}
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value?.toString()}
                  >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                    <SelectItem key={s.supplier_id} value={String(s.supplier_id)}>
                    {s.name}
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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Quantity</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reorder_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reorder Level</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barcode</FormLabel>
              <FormControl>
                <Input 
                  autoComplete="off"
                  {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input 
                  autoComplete="off"
                  placeholder="e.g. ABCD-1234"
                  {...field}/>
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
