import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const { toast } = useToast();
  const [showAuth, setShowAuth] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al iniciar sesión");
      }

      return res.json();
    },
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al registrarse");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "¡Registro exitoso!",
        description: "Bienvenido a K-Market Express",
      });
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    loginMutation.mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    registerMutation.mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
    });
  };

  if (showAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 font-serif text-2xl font-bold mb-2">
              <span className="text-primary">K-Market</span>
              <span>Express</span>
            </div>
            <p className="text-sm text-muted-foreground">Minimarket de conveniencia coreano</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Iniciar Sesión</CardTitle>
                  <CardDescription>
                    Ingresa tus credenciales para acceder
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Contraseña</Label>
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Ingresando..." : "Ingresar"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowAuth(false)}
                    >
                      Volver
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Crear Cuenta</CardTitle>
                  <CardDescription>
                    Regístrate para comenzar a ordenar
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-firstName">Nombre</Label>
                        <Input
                          id="register-firstName"
                          name="firstName"
                          placeholder="Juan"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-lastName">Apellido</Label>
                        <Input
                          id="register-lastName"
                          name="lastName"
                          placeholder="Pérez"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Contraseña</Label>
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Registrando..." : "Crear Cuenta"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowAuth(false)}
                    >
                      Volver
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Demo: admin@kmarket.com / admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 font-serif text-xl font-bold">
          <span className="text-primary">K-Market</span>
          <span>Express</span>
        </div>
        <Button onClick={() => setShowAuth(true)} data-testid="button-login">
          Iniciar Sesión
        </Button>
      </header>

      <Hero isAuthenticated={false} />

      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 text-3xl font-bold">Tus Productos Coreanos Favoritos</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Con K-Market Express, encuentra los mejores productos coreanos: ramens, snacks, 
          bebestibles y tteokbokki. Recoge en nuestro local de Viña del Mar.
        </p>
        <Button size="lg" onClick={() => setShowAuth(true)}>
          Comenzar Ahora
        </Button>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">¿Por qué K-Market Express?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Servicio Express</h3>
              <p className="text-muted-foreground">
                Ordena online y recoge rápidamente en nuestro local. Sin esperas innecesarias.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Productos Auténticos</h3>
              <p className="text-muted-foreground">
                Importamos directamente productos coreanos de la más alta calidad.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Precios Accesibles</h3>
              <p className="text-muted-foreground">
                Los mejores precios en productos coreanos en Viña del Mar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="mb-4 text-3xl font-bold">Encuentra Todo lo que Necesitas</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              En K-Market Express tenemos una amplia selección de productos coreanos para todos los gustos:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">✓</span>
                <span><strong>Ramens:</strong> Desde los clásicos hasta las variedades más picantes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">✓</span>
                <span><strong>Tteokbokki:</strong> Pasteles de arroz tradicionales y con queso</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">✓</span>
                <span><strong>Snacks:</strong> Chips, galletas y dulces coreanos populares</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">✓</span>
                <span><strong>Bebestibles:</strong> Soju, leches saborizadas y bebidas refrescantes</span>
              </li>
            </ul>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-8">
            <h3 className="mb-4 text-2xl font-bold">Horarios de Atención</h3>
            <div className="space-y-2 text-muted-foreground">
              <p className="flex justify-between">
                <span>Lunes - Viernes:</span>
                <span className="font-semibold">10:00 - 20:00</span>
              </p>
              <p className="flex justify-between">
                <span>Sábado:</span>
                <span className="font-semibold">10:00 - 21:00</span>
              </p>
              <p className="flex justify-between">
                <span>Domingo:</span>
                <span className="font-semibold">11:00 - 19:00</span>
              </p>
            </div>
            <div className="mt-6 border-t pt-4">
              <p className="text-sm">
                <strong>Ubicación:</strong><br />
                Viana 405, Local 3<br />
                Viña del Mar
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
