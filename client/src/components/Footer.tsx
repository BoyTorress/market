import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-serif text-2xl font-bold mb-4">
              <span className="text-primary">K-Market</span>
              <span>Express</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Minimarket de conveniencia coreano en Viña del Mar
            </p>
            <p className="text-xs text-muted-foreground">
              Ramens • Snacks • Bebestibles • Tteokbokki
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Contáctanos</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-1 text-primary" />
                <div>
                  <p className="text-sm font-medium">Correo</p>
                  <a 
                    href="mailto:kmarketexpresscl@gmail.com" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    kmarketexpresscl@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-1 text-primary" />
                <div>
                  <p className="text-sm font-medium">Teléfonos</p>
                  <a 
                    href="tel:+56985789956" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                  >
                    +56 9 8578 9956
                  </a>
                  <a 
                    href="tel:+56963744955" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                  >
                    +56 9 6374 4955
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-primary" />
                <div>
                  <p className="text-sm font-medium">Dirección</p>
                  <p className="text-sm text-muted-foreground">
                    Viana 405, Local 3<br />
                    Viña del Mar
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Horarios</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Lunes - Viernes: 10:00 - 20:00</p>
              <p>Sábado: 10:00 - 21:00</p>
              <p>Domingo: 11:00 - 19:00</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} K-Market Express. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Desarrollado por{" "}
            <span className="font-medium text-primary">Brandon Torres</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
