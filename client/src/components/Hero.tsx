import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Korean_market_hero_banner_6f579b9a.png";

interface HeroProps {
  isAuthenticated?: boolean;
  onOrderNow?: () => void;
  onViewMenu?: () => void;
}

export function Hero({ isAuthenticated = false, onOrderNow, onViewMenu }: HeroProps) {
  const handleOrderNow = () => {
    if (onOrderNow) {
      onOrderNow();
    } else if (isAuthenticated) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleViewMenu = () => {
    if (onViewMenu) {
      onViewMenu();
    } else if (isAuthenticated) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 font-serif text-5xl font-bold text-white md:text-6xl" data-testid="text-hero-title">
          K-Market Express
        </h1>
        <p className="mb-2 max-w-2xl text-2xl text-white/95 md:text-3xl font-semibold">
          Minimarket de Conveniencia Coreano
        </p>
        <p className="mb-8 max-w-2xl text-lg text-white/90 md:text-xl" data-testid="text-hero-subtitle">
          Ramens • Snacks • Bebestibles • Tteokbokki
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
            data-testid="button-order-now"
            onClick={handleOrderNow}
          >
            Ordenar Ahora
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="backdrop-blur-sm border-white/40 bg-white/5 text-white hover:bg-white/10"
            data-testid="button-view-menu"
            onClick={handleViewMenu}
          >
            Ver Menú
          </Button>
        </div>
      </div>
    </section>
  );
}
