"use client";

import { CheckoutCard } from '@/components/checkout/checkout-card';
import { getLinkBySlug } from '@/lib/local-data';
import type { PaymentLink } from '@/lib/types';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CheckoutPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [link, setLink] = useState<PaymentLink | null | undefined>(undefined);

  useEffect(() => {
    if (slug) {
      const foundLink = getLinkBySlug(slug);
      setLink(foundLink);
    }
  }, [slug]);

  if (link === undefined) {
    // Loading state
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    );
  }

  if (link === null) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <CheckoutCard link={link} />
      </div>
    </div>
  );
}
