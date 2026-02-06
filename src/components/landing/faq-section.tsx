import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Est-ce que BemPay gère plusieurs devises ?",
    answer: "Pour l'instant, le MVP de BemPay est entièrement axé sur le Franc CFA (XOF) pour répondre au mieux aux besoins du marché malien. La prise en charge d'autres devises est envisagée pour le futur."
  },
  {
    question: "Est-ce que c’est sécurisé ?",
    answer: "La sécurité est notre priorité. BemPay ne stocke aucune information de carte de crédit. Nous nous appuyons sur des prestataires de paiement certifiés et reconnus pour traiter toutes les transactions."
  },
  {
    question: "Combien ça coûte ?",
    answer: "BemPay est actuellement en phase bêta et son utilisation est gratuite pour les premiers inscrits. Le modèle de tarification final sera communiqué avant le lancement officiel. Notre objectif est de proposer un tarif simple et transparent."
  },
  {
    question: "À qui s'adresse BemPay ?",
    answer: "BemPay est conçu pour les créateurs, freelances, consultants, artisans, et tout entrepreneur au Mali qui a besoin d'un moyen simple d'encaisser des paiements, que ce soit localement ou depuis l'international."
  },
  {
    question: "Quand est prévu le lancement officiel ?",
    answer: "Nous travaillons activement à la finalisation du produit. Inscrivez-vous à notre liste d'attente pour être informé en avant-première du lancement et pour bénéficier d'avantages exclusifs."
  }
];

export default function FaqSection() {
  return (
    <section id="faq" className="py-20 sm:py-32 bg-secondary/50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Questions fréquentes</h2>
          <p className="mt-4 text-muted-foreground">
            Vous avez des questions ? Nous avons les réponses.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
