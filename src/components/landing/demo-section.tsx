"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
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

const formSchema = z.object({
  title: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
  amount: z.coerce.number().positive("Le montant doit être un nombre positif"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Link = {
  id: string;
  title: string;
  amount: number;
  description?: string;
  url: string;
  status: "Non payé" | "Payé";
};

export default function DemoSection() {
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedLinks = localStorage.getItem("bemPayLinks");
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    } else {
        // Add some default mock data if localStorage is empty
        const mockLinks: Link[] = [
            { id: 'ABC123', title: "T-shirt 'Mali Dev'", amount: 15000, url: '/p/ABC123', status: 'Non payé'},
            { id: 'DEF456', title: "Consulting (1hr)", amount: 75000, url: '/p/DEF456', status: 'Payé'},
        ];
        setLinks(mockLinks);
        localStorage.setItem("bemPayLinks", JSON.stringify(mockLinks));
    }
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: undefined,
      description: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const slug = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newLink: Link = {
      id: slug,
      title: values.title,
      amount: values.amount,
      description: values.description,
      url: `/p/${slug}`,
      status: "Non payé",
    };

    const updatedLinks = [newLink, ...links];
    setLinks(updatedLinks);
    localStorage.setItem("bemPayLinks", JSON.stringify(updatedLinks));
    
    setGeneratedLink(`${window.location.origin}${newLink.url}`);
    form.reset();
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Copié !",
      description: "Lien de paiement copié dans le presse-papiers.",
    });
  };

  const simulatePayment = (id: string) => {
    const updatedLinks = links.map(link => 
      link.id === id ? { ...link, status: 'Payé' as const } : link
    );
    setLinks(updatedLinks);
    localStorage.setItem("bemPayLinks", JSON.stringify(updatedLinks));
    toast({
      title: "Paiement confirmé (simulé)",
      description: `Le statut du lien ${id} est maintenant "Payé".`,
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-ML', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

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
                    <Input id="amount" type="number" placeholder="e.g., 15000" {...form.register("amount")} />
                    {form.formState.errors.amount && <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>}
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
                    <CardTitle>Liste de vos liens</CardTitle>
                    <CardDescription>Suivez le statut de vos liens générés.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <ul className="divide-y">
                            {links.map(link => (
                                <li key={link.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex-grow">
                                        <p className="font-semibold">{link.title}</p>
                                        <p className="text-sm text-muted-foreground">{formatCurrency(link.amount)}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={link.status === 'Payé' ? 'default' : 'secondary'} className={link.status === 'Payé' ? 'bg-green-500/80' : ''}>
                                            {link.status}
                                        </Badge>
                                        {link.status === 'Non payé' && (
                                            <Button size="sm" variant="outline" onClick={() => simulatePayment(link.id)}>
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
