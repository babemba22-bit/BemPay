import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section id="hero" className="container mx-auto text-center py-20 sm:py-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Encaissez en XOF avec un simple lien de paiement.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          BemPay génère des liens de paiement partageables pour vos produits et services, avec suivi Payé / Non payé.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="#demo">Créer un lien (démo)</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
             <Link href="#liste-attente">Rejoindre la liste d’attente</Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Démo MVP. Les paiements sont simulés.
        </p>
      </div>
    </section>
  );
}
