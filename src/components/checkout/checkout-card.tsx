
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
import { createPayment, markPaymentSuccess } from "@/lib/local-data";
import type { PaymentLink } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Smartphone, Ban, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

const checkoutSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Veuillez entrer une adresse e-mail valide."),
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
    console.log("Form values:", values);
    
    const payment = createPayment({
      link_id: link.link_id,
      payer_name: values.name || "",
      payer_email: values.email,
    });
    console.log("Initiating payment:", payment);

    const isSuccess = Math.random() > 0.2; // 80% success rate

    if (isSuccess) {
      markPaymentSuccess(payment.payment_id, link.link_id);
      console.log("Payment successful, redirecting...");
      router.push(`/payment/success?paymentId=${payment.payment_id}`);
    } else {
      console.log("Payment failed, redirecting...");
      router.push(`/payment/failure?reason=simulation_failed`);
    }
  };
  
  if (link.status === "DISABLED") {
    return (
      <Card className="w-full shadow-xl text-center">
        <CardHeader className="items-center">
            <div className="mx-auto bg-secondary rounded-full p-3 w-fit">
                <Ban className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl pt-4">Lien désactivé</CardTitle>
            <CardDescription>Ce lien de paiement n'est plus actif.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button asChild className="w-full">
                <Link href="/">Retour à l'accueil</Link>
            </Button>
        </CardContent>
      </Card>
    );
  }

  if (link.status === "PAID") {
    return (
        <Card className="w-full shadow-xl text-center">
            <CardHeader className="items-center">
                <div className="mx-auto bg-green-100 dark:bg-green-900/30 rounded-full p-3 w-fit">
                    <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl pt-4">Déjà payé</CardTitle>
                <CardDescription>Ce paiement a déjà été effectué.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button variant="secondary" className="w-full" disabled>
                    Voir le reçu (simulé)
                </Button>
            </CardContent>
        </Card>
    );
  }


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
              <Label htmlFor="name">Nom complet (Optionnel)</Label>
              <Input id="name" placeholder="ex: John Doe" {...form.register("name")} />
              {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input id="email" type="email" placeholder="john@exemple.com" {...form.register("email")} required />
              {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
            </div>
          </div>
          <Separator />
          <RadioGroup defaultValue="cinetpay" onValueChange={(value) => form.setValue('paymentMethod', value as "cinetpay" | "paydunya")}>
            <Label>Moyen de paiement</Label>
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
                  PayDunya (Carte, Mobile Money)
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Payer {formatCurrency(link.amount_xof)}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
