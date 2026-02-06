"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Link as LinkIcon, ArrowRightLeft } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Liens de paiement", icon: <LinkIcon className="h-4 w-4"/> },
  { href: "/dashboard/payments", label: "Transactions", icon: <ArrowRightLeft className="h-4 w-4" /> },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="mb-4 border-b">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium",
              pathname === link.href
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground"
            )}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
