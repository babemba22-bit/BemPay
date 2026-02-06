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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Payment, PaymentLink } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type PaymentsListTableProps = {
  payments: Payment[];
  links: PaymentLink[];
  totalPaymentCount: number;
  filter: Payment['status'] | 'ALL';
  onFilterChange: (filter: Payment['status'] | 'ALL') => void;
  filteredByLinkTitle?: string;
};

const statusTranslations: Record<Payment['status'], string> = {
  INITIATED: 'INVOQUÉ',
  SUCCESS: 'SUCCÈS',
  FAILED: 'ÉCHOUÉ',
};

const filters: (Payment['status'] | 'ALL')[] = ['ALL', 'SUCCESS', 'FAILED', 'INITIATED'];
const filterTranslations: Record<Payment['status'] | 'ALL', string> = {
  ALL: 'Toutes',
  SUCCESS: 'Succès',
  FAILED: 'Échouées',
  INITIATED: 'Invoquées',
};

export function PaymentsListTable({ payments, links, totalPaymentCount, filter, onFilterChange, filteredByLinkTitle }: PaymentsListTableProps) {
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
                <CardTitle>Transactions</CardTitle>
                <CardDescription className="mt-1">
                  {filteredByLinkTitle 
                    ? <>Transactions pour le lien <span className="font-medium text-foreground">"{filteredByLinkTitle}"</span>. <Link href="/dashboard/payments" className="text-primary underline">Voir tout</Link></>
                    : "Suivez toutes les transactions sur la plateforme."
                  }
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
              <TableHead>Lien de paiement</TableHead>
              <TableHead className="hidden sm:table-cell">Payeur</TableHead>
              <TableHead className="hidden sm:table-cell">Statut</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  {totalPaymentCount === 0
                    ? "Aucune transaction pour le moment."
                    : "Aucune transaction ne correspond à ce filtre."
                  }
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => {
                const link = links.find(l => l.link_id === payment.link_id);
                const dateToShow = payment.paid_at || payment.created_at;

                return (
                  <TableRow key={payment.payment_id}>
                    <TableCell>
                      <div className="font-medium">{link?.title || 'Lien supprimé'}</div>
                      <div className="text-sm text-muted-foreground md:hidden">{payment.payer_email}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{payment.payer_email}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge 
                        variant={
                          payment.status === 'SUCCESS' ? 'default' :
                          payment.status === 'FAILED' ? 'destructive' :
                          'secondary'
                        }
                        className={
                          payment.status === 'SUCCESS' ? 'bg-green-500/80 dark:bg-green-500/50 hover:bg-green-500/90 text-white' 
                          : ''
                        }
                      >
                        {statusTranslations[payment.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {dateToShow ? formatDistanceToNow(new Date(dateToShow), { addSuffix: true }) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {link ? formatCurrency(link.amount_xof) : '-'}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
