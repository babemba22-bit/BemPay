"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PaymentLink } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { createLink, listLinks, updateLinkStatus } from "@/lib/local-data";

const formSchema = z.object({
  title: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
  amount_xof: z.coerce.number().positive("Le montant doit être un nombre positif"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function DemoSection() {
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const { toast } = useToast();
  const [links, setLinks] = useState<PaymentLink[]>([]);

  const refreshLinks = useCallback(() => {
    // Show only the 3 most recent links for the demo
    setLinks(listLinks().slice(0, 3));
  }, []);

  useEffect(() => {
    refreshLinks();
    
    const handleStorageChange = () => refreshLinks();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshLinks]);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount_xof: undefined,
      description: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const newLink = createLink(values);
    setGeneratedLink(`${window.location.origin}/p/${newLink.slug}`);
    form.reset();
    refreshLinks();
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Copié !",
      description: "Lien de paiement copié dans le presse-papiers.",
    });
  };

  const handleSimulatePayment = (linkId: string) => {
    updateLinkStatus(linkId, "PAID");
    refreshLinks();
    toast({
      title: "Paiement confirmé (simulé)",
      description: `Le statut du lien est maintenant "Payé".`,
    });
  };
  
  return (
    <section id="demo" className="py-20 sm:py-32 bg-secondary/50">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Démo interactive</h2>
          <p className="mt-4 text-muted-foreground">
            Testez la création d'un lien de paiement. Tout est sauvegardé localement dans votre navigateur.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <Card className="w-full lg:col-span-1 shadow-lg">
              <CardHeader>
                <CardTitle>Générer un lien</CardTitle>
              </CardHeader>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre</Label>
                    <Input id="title" placeholder="e.g., T-shirt 'Mali Dev'" {...form.register("title")} />
                    {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Montant (XOF)</Label>
                    <Input id="amount" type="number" placeholder="e.g., 15000" {...form.register("amount_xof")} />
                    {form.formState.errors.amount_xof && <p className="text-sm text-destructive">{form.formState.errors.amount_xof.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optionnel)</Label>
                    <Textarea id="description" placeholder="Décrivez votre produit/service." {...form.register("description")} />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Générer mon lien
                  </Button>
                  {generatedLink && (
                    <div className="w-full space-y-2 rounded-lg border bg-background p-3">
                      <Label>Votre lien est prêt !</Label>
                      <div className="flex items-center gap-2">
                        <Input value={generatedLink} readOnly />
                        <Button type="button" size="icon" variant="ghost" onClick={handleCopy}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </form>
            </Card>

            <Card className="lg:col-span-2 shadow-lg">
                <CardHeader>
                    <CardTitle>Vos liens récents</CardTitle>
                    <CardDescription>Suivez le statut de vos liens générés.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <ul className="divide-y">
                             {links.length === 0 && (
                                <li className="p-4 text-center text-muted-foreground">Créez un lien pour le voir ici.</li>
                            )}
                            {links.map(link => (
                                <li key={link.link_id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex-grow">
                                        <p className="font-semibold">{link.title}</p>
                                        <p className="text-sm text-muted-foreground">{formatCurrency(link.amount_xof)}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={link.status === 'PAID' ? 'default' : 'secondary'} className={link.status === 'PAID' ? 'bg-green-500/80 hover:bg-green-500/90' : ''}>
                                            {link.status}
                                        </Badge>
                                        {link.status === 'ACTIVE' && (
                                            <Button size="sm" variant="outline" onClick={() => handleSimulatePayment(link.link_id)}>
                                                Simuler paiement
                                            </Button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}
