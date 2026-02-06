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
import { Copy, ExternalLink, MoreHorizontal, PowerOff } from "lucide-react";
import Link from "next/link";

type LinksListTableProps = {
  links: PaymentLink[];
  onLinkUpdated: () => void;
};

export function LinksListTable({ links, onLinkUpdated }: LinksListTableProps) {
  const { toast } = useToast();

  const handleCopy = (slug: string) => {
    const link = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Payment link copied to clipboard.",
    });
  };

  const handleDisable = (link_id: string) => {
    updateLinkStatus(link_id, "DISABLED");
    onLinkUpdated();
    toast({
      title: "Link Disabled",
      description: "The payment link has been disabled.",
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Your Payment Links</CardTitle>
        <CardDescription>
          Here's a list of all your payment links.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Amount</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">No links created yet.</TableCell>
              </TableRow>
            )}
            {links.map((link) => (
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
                      link.status === 'PAID' ? 'bg-green-500/80 dark:bg-green-500/50 hover:bg-green-500/90' 
                      : link.status === 'DISABLED' ? 'bg-red-500/80 dark:bg-red-500/50 hover:bg-red-500/90' 
                      : ''
                    }
                  >
                    {link.status}
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
                          <ExternalLink className="mr-2 h-4 w-4" /> Open
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopy(link.slug)}>
                        <Copy className="mr-2 h-4 w-4" /> Copy link
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDisable(link.link_id)}
                        disabled={link.status === "DISABLED"}
                        className="text-red-600 focus:text-red-600"
                      >
                        <PowerOff className="mr-2 h-4 w-4" /> Disable
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
