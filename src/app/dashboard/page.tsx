"use client";

import { CreateLinkForm } from "@/components/dashboard/create-link-form";
import { LinksListTable } from "@/components/dashboard/links-list-table";
import { getSession, listLinks } from "@/lib/local-data";
import type { PaymentLink } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [filter, setFilter] = useState<PaymentLink['status'] | 'ALL'>('ALL');

  const refreshLinks = useCallback(() => {
    setLinks(listLinks());
  }, []);

  useEffect(() => {
    if (!getSession().isAuthed) {
      router.replace('/login');
    } else {
      refreshLinks();
    }
    
    const handleStorageChange = () => {
      if (!getSession().isAuthed) {
        router.replace('/login');
      } else {
        refreshLinks();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, [router, refreshLinks]);

  const filteredLinks = useMemo(() => {
    if (filter === 'ALL') {
      return links;
    }
    return links.filter(link => link.status === filter);
  }, [links, filter]);


  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <CreateLinkForm onLinkCreated={refreshLinks} />
      </div>
      <div className="lg:col-span-2">
        <LinksListTable 
          links={filteredLinks} 
          totalLinkCount={links.length}
          onLinkUpdated={refreshLinks}
          filter={filter}
          onFilterChange={setFilter}
        />
      </div>
    </div>
  );
}
