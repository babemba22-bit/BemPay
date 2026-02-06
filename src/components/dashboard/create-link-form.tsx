"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateLinkForm() {
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: undefined,
      description: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // In a real app, you'd call an API here.
    const slug = values.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50);
    const newLink = `${window.location.origin}/p/${slug}`;
    setGeneratedLink(newLink);
    form.reset();
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Copied!",
      description: "Payment link copied to clipboard.",
    });
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Create a Payment Link</CardTitle>
        <CardDescription>
          Generate a new link to receive payments.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g., T-shirt 'Mali Dev'" {...form.register("title")} />
            {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (XOF)</Label>
            <Input id="amount" type="number" placeholder="e.g., 15000" {...form.register("amount")} />
            {form.formState.errors.amount && <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe what you're selling."
              {...form.register("description")}
            />
          </div>
          {generatedLink && (
            <div className="space-y-2 rounded-lg border bg-secondary/50 p-3">
              <Label>Your new link is ready!</Label>
              <div className="flex items-center gap-2">
                <Input value={generatedLink} readOnly className="bg-background"/>
                <Button type="button" size="icon" variant="ghost" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Générer le lien
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
