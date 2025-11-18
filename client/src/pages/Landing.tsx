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

      <Hero />

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

      <Footer />
    </div>
  );
}
