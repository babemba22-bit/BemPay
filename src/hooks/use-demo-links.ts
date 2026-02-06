"use client";

import { useState, useEffect } from "react";
import type { DemoLink } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const LOCAL_STORAGE_KEY = "bemPayLinks";

const initialLinks: DemoLink[] = [
    { id: 'ABC123', title: "T-shirt 'Mali Dev'", amount: 15000, url: '/p/ABC123', status: 'Non payé'},
    { id: 'DEF456', title: "Consulting (1hr)", amount: 75000, url: '/p/DEF456', status: 'Payé'},
];

export function useDemoLinks() {
  const [links, setLinks] = useState<DemoLink[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedLinks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    } else {
      setLinks(initialLinks);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialLinks));
    }
  }, []);

  const addLink = (link: DemoLink) => {
    const updatedLinks = [link, ...links];
    setLinks(updatedLinks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedLinks));
  };

  const simulatePayment = (id: string) => {
    const updatedLinks = links.map(link => 
      link.id === id ? { ...link, status: 'Payé' as const } : link
    );
    setLinks(updatedLinks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedLinks));
    toast({
      title: "Paiement confirmé (simulé)",
      description: `Le statut du lien ${id} est maintenant "Payé".`,
    });
  };

  return { links, addLink, simulatePayment };
}
