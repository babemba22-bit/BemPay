
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { updateLinkStatus } from "@/lib/local-data";
import type { PaymentLink } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ArrowRightLeft, Copy, ExternalLink, MoreHorizontal, PowerOff } from "lucide-react";
import Link from "next/link";

type LinksListTableProps = {
  links: PaymentLink[];
  totalLinkCount: number;
  onLinkUpdated: () => void;
  filter: PaymentLink['status'] | 'ALL';
  onFilterChange: (filter: PaymentLink['status'] | 'ALL') => void;
};

const statusTranslations: Record<PaymentLink['status'], string> = {
  ACTIVE: 'ACTIF',
  PAID: 'PAYÉ',
  DISABLED: 'DÉSACTIVÉ',
};

const filters: (PaymentLink['status'] | 'ALL')[] = ['ALL', 'ACTIVE', 'PAID', 'DISABLED'];
const filterTranslations: Record<PaymentLink['status'] | 'ALL', string> = {
  ALL: 'Tous',
  ACTIVE: 'Actifs',
  PAID: 'Payés',
  DISABLED: 'Désactivés',
};


export function LinksListTable({ links, totalLinkCount, onLinkUpdated, filter, onFilterChange }: LinksListTableProps) {
  const { toast } = useToast();

  const handleCopy = (slug: string) => {
    const link = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copié !",
      description: "Lien de paiement copié dans le presse-papiers.",
    });
  };

  const handleDisable = (link_id: string) => {
    updateLinkStatus(link_id, "DISABLED");
    onLinkUpdated();
    toast({
      title: "Lien désactivé",
      description: "Le lien de paiement a été désactivé.",
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
                <CardTitle>Vos liens de paiement</CardTitle>
                <CardDescription className="mt-1">
                  Gérez et suivez l'état de tous vos liens.
                </CardDescription>
            </div>
            <div className="flex items-center gap-1 border rounded-md p-1 bg-secondary/50 self-start">
                {filters.map(f => (
                    <Button
                        key={f}
                        variant={filter === f ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => onFilterChange(f)}
                        className={`h-8 px-3 ${filter === f ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background'}`}
                    >
                        {filterTranslations[f]}
                    </Button>
                ))}
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead className="hidden sm:table-cell">Statut</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Montant</TableHead>
              <TableHead className="hidden md:table-cell">Créé le</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  {totalLinkCount === 0
                    ? "Aucun lien créé pour le moment."
                    : "Aucun lien ne correspond à ce filtre."
                  }
                </TableCell>
              </TableRow>
            ) : (
              links.map((link) => (
              <TableRow key={link.link_id}>
                <TableCell>
                  <div className="font-medium">{link.title}</div>
                  <div className="text-sm text-muted-foreground md:hidden">{formatCurrency(link.amount_xof)}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge 
                    variant={
                      link.status === 'PAID' ? 'default' :
                      link.status === 'ACTIVE' ? 'secondary' :
                      'outline'
                    }
                    className={
                      link.status === 'PAID' ? 'bg-green-500/80 dark:bg-green-500/50 hover:bg-green-500/90 text-white' 
                      : link.status === 'DISABLED' ? 'bg-red-500/80 dark:bg-red-500/50 hover:bg-red-500/90 text-white' 
                      : ''
                    }
                  >
                    {statusTranslations[link.status]}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-right">
                  {formatCurrency(link.amount_xof)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDistanceToNow(new Date(link.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/p/${link.slug}`} target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4" /> Ouvrir
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopy(link.slug)}>
                        <Copy className="mr-2 h-4 w-4" /> Copier le lien
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/payments?link_id=${link.link_id}`}>
                          <ArrowRightLeft className="mr-2 h-4 w-4" /> Voir les transactions
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDisable(link.link_id)}
                        disabled={link.status === "DISABLED"}
                        className="text-red-600 focus:text-red-600"
                      >
                        <PowerOff className="mr-2 h-4 w-4" /> Désactiver
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
