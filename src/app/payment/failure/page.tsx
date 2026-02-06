import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailurePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader className="items-center">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
            <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="mt-4 text-2xl">Payment Failed</CardTitle>
          <CardDescription className="mt-2">
            Unfortunately, your payment could not be processed. Please try again or use a different payment method.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            {/* In a real app, this would link back to the specific checkout page */}
            <Link href="/dashboard">Try Again</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
