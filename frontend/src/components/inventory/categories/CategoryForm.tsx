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

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormValues>;
  categories?: { category_id: number; name: string }[];
  onSubmit: (values: CategoryFormValues) => void;
  submitLabel?: string;
  isMutating?: any
  initialValues?: CategoryFormValues,
}

export default function CategoryForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save",
  isMutating
}: CategoryFormProps) {

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
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
              <FormLabel>Category name</FormLabel>
              <FormControl>
                <Input
                  autoFocus {...field} 
                  autoComplete="off"
                  placeholder="e.g. Tools" 
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
