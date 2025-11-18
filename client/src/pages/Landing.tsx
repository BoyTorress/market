import { Button } from "@/components/ui/button";
import { Hero } from "@/components/Hero";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 font-serif text-xl font-bold">
          <span className="text-primary">Market</span>
          <span>Express</span>
        </div>
        <Button asChild data-testid="button-login">
          <a href="/api/login">Iniciar Sesión</a>
        </Button>
      </header>

      <Hero />

      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 text-3xl font-bold">Ordena Fácil, Recoge Rápido</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Con MarketExpress, puedes explorar nuestro menú completo, personalizar tu pedido
          y programar la hora de retiro que mejor te convenga. Todo desde la comodidad de tu dispositivo.
        </p>
        <Button size="lg" asChild>
          <a href="/api/login">Comenzar Ahora</a>
        </Button>
      </section>
    </div>
  );
}
