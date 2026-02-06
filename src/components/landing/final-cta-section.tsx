"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function FinalCtaSection() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email && email.includes('@')) {
            setSubmitted(true);
            toast({
                title: "Inscription réussie !",
                description: "Merci ! Vous êtes sur la liste d'attente.",
            });
        } else {
             toast({
                variant: "destructive",
                title: "Email invalide",
                description: "Veuillez entrer une adresse email valide.",
            });
        }
    };

    return (
        <section id="liste-attente" className="py-20 sm:py-32">
            <div className="container mx-auto text-center max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold">Prêt à simplifier vos paiements ?</h2>
                <p className="mt-4 text-muted-foreground">
                    Rejoignez la liste d'attente pour être le premier informé du lancement de BemPay et bénéficier d'offres exclusives.
                </p>
                <div className="mt-8">
                    {submitted ? (
                        <p className="text-lg text-green-600 font-semibold">Merci pour votre inscription ! Nous vous contacterons bientôt.</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <Input
                                type="email"
                                placeholder="Votre adresse email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 text-base"
                            />
                            <Button type="submit" size="lg" className="h-12">Rejoindre</Button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
