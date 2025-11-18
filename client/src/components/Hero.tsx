import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Hero_ramen_bowl_image_a8d1c990.png";

export function Hero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      
      <div className="relative container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 font-serif text-5xl font-bold text-white md:text-6xl" data-testid="text-hero-title">
          Auténtico Ramen Japonés
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-white/90 md:text-xl" data-testid="text-hero-subtitle">
          Ordena tus platillos favoritos y recógelos en nuestro local. 
          Sabor tradicional, servicio express.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
            data-testid="button-order-now"
          >
            Ordenar Ahora
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="backdrop-blur-sm border-white/40 bg-white/5 text-white hover:bg-white/10"
            data-testid="button-view-menu"
          >
            Ver Menú
          </Button>
        </div>
      </div>
    </section>
  );
}
