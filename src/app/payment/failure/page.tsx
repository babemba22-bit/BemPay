"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const reasonMessages: Record<string, string> = {
  simulation_failed: "Le paiement a été marqué comme échoué pour cette simulation.",
  payment_declined: "La transaction a été refusée par votre banque.",
  insufficient_funds: "Fonds insuffisants sur votre compte.",
  default: "Une erreur inattendue est survenue. Veuillez réessayer plus tard.",
};

export default function PaymentFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'default';
  const message = reasonMessages[reason] || reasonMessages.default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader className="items-center">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
            <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="mt-4 text-2xl">Paiement non abouti</CardTitle>
          <CardDescription className="mt-2 px-4">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                Ne vous inquiétez pas, vous n'avez pas été débité.
            </p>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button onClick={() => router.back()} className="w-full">
            <RefreshCw className="mr-2" />
            Réessayer le paiement
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
