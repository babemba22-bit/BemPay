import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PencilLine, Share2, GanttChartSquare } from "lucide-react";

const steps = [
  {
    icon: <PencilLine className="w-8 h-8 mb-4 text-primary" />,
    title: "1. Créez votre lien",
    description: "Renseignez le titre, le montant en XOF et une description pour votre produit ou service.",
  },
  {
    icon: <Share2 className="w-8 h-8 mb-4 text-primary" />,
    title: "2. Partagez-le à votre client",
    description: "Copiez le lien généré et envoyez-le via WhatsApp, email ou sur vos réseaux sociaux.",
  },
  {
    icon: <GanttChartSquare className="w-8 h-8 mb-4 text-primary" />,
    title: "3. Suivez le statut",
    description: "Visualisez en temps réel si le paiement a été effectué depuis votre liste de liens.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="comment-ca-marche" className="bg-secondary/50 py-20 sm:py-32">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Comment ça marche ?</h2>
          <p className="mt-4 text-muted-foreground">En trois étapes simples, commencez à encaisser vos paiements.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                {step.icon}
                <CardTitle>{step.title}</CardTitle>
                <CardDescription className="mt-2">{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
