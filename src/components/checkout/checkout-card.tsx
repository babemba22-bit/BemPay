
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
import { createPayment, markPaymentFailure, markPaymentSuccess } from "@/lib/local-data";
import type { PaymentLink } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Smartphone, Ban, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { cn } from "@/lib/utils";


const formSchema = z.discriminatedUnion('paymentMethod', [
  z.object({
    paymentMethod: z.literal('mobile'),
    name: z.string().optional(),
    email: z.string().email({ message: "Veuillez entrer une adresse e-mail valide." }),
    phone: z.string().min(8, "Numéro de téléphone invalide.").refine(val => /^(?:\+223\s?)?[5-9](?:[0-9]\s?){7}$/.test(val.trim()), {
      message: 'Numéro de téléphone malien valide requis (ex: 70123456).',
    }),
  }),
  z.object({
    paymentMethod: z.literal('card'),
    email: z.string().email({ message: "Veuillez entrer une adresse e-mail valide." }),
    cardName: z.string().min(2, 'Le nom sur la carte est requis.'),
    cardNumber: z.string().length(16, 'Le numéro de carte doit comporter 16 chiffres.').regex(/^\d+$/, "Le numéro de carte ne doit contenir que des chiffres."),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/, 'La date doit être au format MM/AA.'),
    cvv: z.string().length(3, 'Le CVV doit comporter 3 chiffres.').regex(/^\d+$/, "Le CVV ne doit contenir que des chiffres."),
  }),
]);

type CheckoutFormValues = z.infer<typeof formSchema>;

type CheckoutCardProps = {
  link: PaymentLink;
};

export function CheckoutCard({ link }: CheckoutCardProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "mobile",
      email: "",
      name: "",
      phone: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  const onSubmit = async (values: CheckoutFormValues, forceFailure = false) => {
    setIsProcessing(true);
    
    let payment;
    if (values.paymentMethod === 'mobile') {
      payment = createPayment({
        link_id: link.link_id,
        payer_name: values.name || "",
        payer_email: values.email,
        provider: 'ORANGE_MONEY',
        payer_phone: values.phone,
      });
    } else {
      payment = createPayment({
        link_id: link.link_id,
        payer_name: values.cardName,
        payer_email: values.email,
        provider: 'VISA',
        card_last4: values.cardNumber.slice(-4),
      });
    }
    
    // Simulate network delay of 1.5s
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isSuccess = !forceFailure && Math.random() > 0.15; // 85% success rate

    if (isSuccess) {
      markPaymentSuccess(payment.payment_id, link.link_id);
      router.push(`/payment/success?paymentId=${payment.payment_id}`);
    } else {
      markPaymentFailure(payment.payment_id);
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
        {link.description && <CardDescription>{link.description}</CardDescription>}
        <div className="text-4xl font-bold text-primary pt-4">
          {formatCurrency(link.amount_xof)}
        </div>
      </CardHeader>
      <Separator />
      <form onSubmit={form.handleSubmit(values => onSubmit(values, false))}>
        <CardContent className="pt-6 space-y-6">
          
          <Controller
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="mobile"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    field.value === 'mobile' && "border-primary"
                  )}
                >
                  <RadioGroupItem value="mobile" id="mobile" className="sr-only" />
                  <Smartphone className="mb-3 h-6 w-6" />
                  Mobile Money
                </Label>
                <Label
                  htmlFor="card"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    field.value === 'card' && "border-primary"
                  )}
                >
                  <RadioGroupItem value="card" id="card" className="sr-only" />
                  <CreditCard className="mb-3 h-6 w-6" />
                  Carte Visa
                </Label>
              </RadioGroup>
            )}
          />

          <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input id="email" type="email" placeholder="john@exemple.com" {...form.register("email")} required />
                {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
              </div>

             {paymentMethod === 'mobile' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Numéro Orange Money</Label>
                    <Input id="phone" placeholder="+223 XX XX XX XX" {...form.register("phone")} />
                    {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet (Optionnel)</Label>
                    <Input id="name" placeholder="ex: John Doe" {...form.register("name")} />
                  </div>
                </>
              )}

              {paymentMethod === 'card' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nom sur la carte</Label>
                    <Input id="cardName" placeholder="John Doe" {...form.register("cardName")} />
                    {form.formState.errors.cardName && <p className="text-sm text-destructive">{form.formState.errors.cardName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Numéro de carte</Label>
                    <Input id="cardNumber" placeholder="•••• •••• •••• ••••" {...form.register("cardNumber")} />
                    {form.formState.errors.cardNumber && <p className="text-sm text-destructive">{form.formState.errors.cardNumber.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiration (MM/AA)</Label>
                      <Input id="expiry" placeholder="MM/AA" {...form.register("expiry")} />
                      {form.formState.errors.expiry && <p className="text-sm text-destructive">{form.formState.errors.expiry.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="•••" {...form.register("cvv")} />
                      {form.formState.errors.cvv && <p className="text-sm text-destructive">{form.formState.errors.cvv.message}</p>}
                    </div>
                  </div>
                </>
              )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
            <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Traitement...
                    </>
                ) : (
                    `Payer ${formatCurrency(link.amount_xof)}`
                )}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
                {paymentMethod === 'mobile' 
                    ? "Tu recevras une confirmation après validation (mode démo)." 
                    : "Démo: aucune donnée carte n’est enregistrée."
                }
            </p>
             <div className="text-center mt-2">
                <button
                    type="button"
                    onClick={() => form.handleSubmit(values => onSubmit(values, true))()}
                    className="text-xs text-muted-foreground hover:text-foreground underline disabled:no-underline disabled:opacity-50"
                    disabled={isProcessing}
                >
                    Simuler un échec de paiement
                </button>
            </div>
        </CardFooter>
      </form>
    </Card>
  );
}
