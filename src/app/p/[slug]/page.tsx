import { CheckoutCard } from '@/components/checkout/checkout-card';
import { mockPaymentLinks } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

type CheckoutPageProps = {
  params: {
    slug: string;
  };
};

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const link = mockPaymentLinks.find((l) => l.slug === params.slug);

  if (!link) {
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
