import Header from '@/components/header';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto py-4 px-4 md:px-8 text-center text-sm text-muted-foreground">
          &copy; {currentYear} BemPay. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
