
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { listLinks, listPayments } from '@/lib/local-data';
import type { Payment, PaymentLink } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Home } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  
  const [payment, setPayment] = useState<Payment | null>(null);
  const [link, setLink] = useState<PaymentLink | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paymentId) {
      const allPayments = listPayments();
      const foundPayment = allPayments.find(p => p.payment_id === paymentId);
      
      if (foundPayment) {
        setPayment(foundPayment);
        const allLinks = listLinks();
        const foundLink = allLinks.find(l => l.link_id === foundPayment.link_id);
        setLink(foundLink || null);
      }
    }
    setLoading(false);
  }, [paymentId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Skeleton className="h-[450px] w-full max-w-md" />
      </div>
    );
  }

  if (!payment || !link) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-background px-4">
         <Card className="w-full max-w-md text-center shadow-xl">
           <CardHeader className="items-center">
             <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
               <CheckCircle2 className="h-12 w-12 text-red-600 dark:text-red-400" />
             </div>
             <CardTitle className="mt-4 text-2xl">Transaction introuvable</CardTitle>
             <CardDescription className="mt-2">
               Nous n'avons pas pu trouver les détails de cette transaction.
             </CardDescription>
           </CardHeader>
           <CardContent>
             <Button asChild className="w-full">
               <Link href="/dashboard">Retour au tableau de bord</Link>
             </Button>
           </CardContent>
         </Card>
       </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-8">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader className="items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="mt-4 text-2xl">Paiement Réussi !</CardTitle>
          <CardDescription className="mt-2">
            Merci ! Votre transaction a été complétée avec succès.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-left space-y-4">
          <Separator />
           <div className="space-y-3">
              <h3 className="font-semibold">Résumé de la transaction</h3>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Produit</span>
                <span className="font-medium">{link.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Montant payé</span>
                <span className="font-medium">{formatCurrency(link.amount_xof)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payé par</span>
                <span className="font-medium">{payment.payer_email}</span>
              </div>
               <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {new Date(payment.paid_at!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
           </div>
          <Separator />
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/dashboard">Retour au tableau de bord</Link>
          </Button>
           <Button asChild variant="ghost" className="w-full text-muted-foreground">
            <Link href="/">
              <Home className="mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <Skeleton className="h-[450px] w-full max-w-md" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}
