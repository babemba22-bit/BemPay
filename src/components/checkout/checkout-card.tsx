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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import type { PaymentLink } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  paymentMethod: z.enum(["cinetpay", "paydunya"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type CheckoutCardProps = {
  link: PaymentLink;
};

export function CheckoutCard({ link }: CheckoutCardProps) {
  const router = useRouter();
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      paymentMethod: "cinetpay",
    },
  });

  const onSubmit = (values: CheckoutFormValues) => {
    console.log("Initiating payment with:", values);
    // Simulate a payment process
    // In a real app, you would redirect to the payment provider's page
    // or use their SDK.
    const isSuccess = Math.random() > 0.2; // 80% success rate
    if (isSuccess) {
      router.push("/payment/success");
    } else {
      router.push("/payment/failure");
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{link.title}</CardTitle>
        <CardDescription>{link.description}</CardDescription>
        <div className="text-4xl font-bold text-primary pt-4">
          {formatCurrency(link.amount_xof)}
        </div>
      </CardHeader>
      <Separator />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" {...form.register("name")} />
              {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" {...form.register("email")} />
              {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
            </div>
          </div>
          <Separator />
          <RadioGroup defaultValue="cinetpay" {...form.register("paymentMethod")}>
            <Label>Payment Method</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:border-primary has-[[data-state=checked]]:border-primary">
                <RadioGroupItem value="cinetpay" id="cinetpay" />
                <Label htmlFor="cinetpay" className="flex items-center gap-3 cursor-pointer text-base">
                  <Smartphone className="h-5 w-5" />
                  CinetPay (Mobile Money)
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:border-primary has-[[data-state=checked]]:border-primary">
                <RadioGroupItem value="paydunya" id="paydunya" />
                <Label htmlFor="paydunya" className="flex items-center gap-3 cursor-pointer text-base">
                  <CreditCard className="h-5 w-5" />
                  PayDunya (Card, Mobile Money)
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={link.status !== 'ACTIVE' || form.formState.isSubmitting}>
            {link.status === 'ACTIVE' ? `Payer ${formatCurrency(link.amount_xof)}` : `Link is ${link.status}`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
