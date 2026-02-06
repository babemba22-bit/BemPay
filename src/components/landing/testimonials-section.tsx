import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "“Enfin un moyen simple de me faire payer par mes clients à l'étranger sans prise de tête. La mise en place a pris deux minutes.”",
    author: "Fatoumata K.",
    title: "Graphiste freelance",
    avatarSeed: "Fatoumata"
  },
  {
    quote: "“Je vends des créations artisanales en ligne. BemPay m'a permis de centraliser mes paiements et de suivre facilement qui a payé. C'est un gain de temps énorme.”",
    author: "Moussa T.",
    title: "Artisan créateur",
    avatarSeed: "Moussa"
  }
]

export default function TestimonialsSection() {
  return (
    <section id="temoignages" className="py-20 sm:py-32">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Ils nous font confiance</h2>
          <p className="mt-4 text-muted-foreground">Découvrez ce que les premiers utilisateurs pensent de BemPay.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author} className="p-6">
              <CardContent className="p-0">
                <p className="italic text-muted-foreground">{testimonial.quote}</p>
                <div className="flex items-center gap-4 mt-6">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${testimonial.avatarSeed}`} />
                    <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
