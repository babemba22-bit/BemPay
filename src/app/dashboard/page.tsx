"use client";

import { CreateLinkForm } from "@/components/dashboard/create-link-form";
import { LinksListTable } from "@/components/dashboard/links-list-table";
import { getSession, listLinks } from "@/lib/local-data";
import type { PaymentLink } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [links, setLinks] = useState<PaymentLink[]>([]);

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


  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <CreateLinkForm onLinkCreated={refreshLinks} />
      </div>
      <div className="lg:col-span-2">
        <LinksListTable links={links} onLinkUpdated={refreshLinks} />
      </div>
    </div>
  );
}
