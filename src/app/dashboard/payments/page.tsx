
"use client";

import { PaymentsListTable } from "@/components/dashboard/payments-list-table";
import { Skeleton } from "@/components/ui/skeleton";
import { listLinks, listPayments } from "@/lib/local-data";
import type { Payment, PaymentLink } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback, Suspense } from "react";

function PaymentsPageContent() {
  const searchParams = useSearchParams();
  const linkIdFilter = searchParams.get('link_id');

  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [allLinks, setAllLinks] = useState<PaymentLink[]>([]);
  const [statusFilter, setStatusFilter] = useState<Payment['status'] | 'ALL'>('ALL');
  
  const refreshData = useCallback(() => {
    setAllPayments(listPayments());
    setAllLinks(listLinks());
  }, []);

  useEffect(() => {
    refreshData();
    
    const handleStorageChange = () => {
      refreshData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshData]);

  const filteredPayments = useMemo(() => {
    return allPayments.filter(payment => {
      const statusMatch = statusFilter === 'ALL' || payment.status === statusFilter;
      const linkIdMatch = !linkIdFilter || payment.link_id === linkIdFilter;
      return statusMatch && linkIdMatch;
    });
  }, [allPayments, statusFilter, linkIdFilter]);

  const filteredByLinkTitle = useMemo(() => {
    if (!linkIdFilter) return undefined;
    return allLinks.find(link => link.link_id === linkIdFilter)?.title;
  }, [allLinks, linkIdFilter]);

  return (
    <div>
      <PaymentsListTable 
        payments={filteredPayments} 
        links={allLinks}
        totalPaymentCount={allPayments.length}
        filter={statusFilter}
        onFilterChange={setStatusFilter}
        filteredByLinkTitle={filteredByLinkTitle}
      />
    </div>
  );
}

export default function PaymentsPage() {
    return (
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <PaymentsPageContent />
        </Suspense>
    );
}
