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

const usernameSchema = z.object({
  username: z
  .string()
  .min(3, { message: "Username must be at least 3 characters long." })
  .max(20, { message: "Username cannot exceed 20 characters." })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores.",
  }),
});


export type UsernameFormValues = z.infer<typeof usernameSchema>;

interface UsernameFormProps {
  defaultValues?: Partial<UsernameFormValues>;
  onSubmit: (values: UsernameFormValues) => void;
  submitLabel?: string;
  isMutating?: any
  initialValues?: UsernameFormValues,
}

export default function UsernameForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save",
  isMutating
}: UsernameFormProps) {


  const form = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input 
                  autoFocus
                  autoComplete="off"
                  placeholder="e.g. handymanny" 
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
