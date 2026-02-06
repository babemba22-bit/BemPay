import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Smartphone, Link as LinkIcon, MapPin } from "lucide-react";

const benefits = [
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: "Simple en 60 secondes",
    description: "Créez un lien de paiement en moins d'une minute, sans paperasse compliquée.",
  },
  {
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    title: "Partage facile",
    description: "Intégration parfaite avec WhatsApp, Email, et tous vos canaux de communication.",
  },
  {
    icon: <LinkIcon className="w-8 h-8 text-primary" />,
    title: "Suivi des liens",
    description: "Gardez un oeil sur chaque transaction avec un statut clair : Payé ou Non payé.",
  },
  {
    icon: <MapPin className="w-8 h-8 text-primary" />,
    title: "Conçu pour le Mali",
    description: "Encaissez directement en Francs CFA (XOF), la devise que vos clients utilisent.",
  },
];

export default function WhyBemPaySection() {
  return (
    <section id="pourquoi" className="py-20 sm:py-32">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Pourquoi BemPay ?</h2>
          <p className="mt-4 text-muted-foreground">La solution de paiement pensée pour les réalités des créateurs maliens.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="bg-secondary/30 border-0 shadow-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                {benefit.icon}
                <CardTitle className="mt-4">{benefit.title}</CardTitle>
                <CardDescription className="mt-2">{benefit.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
