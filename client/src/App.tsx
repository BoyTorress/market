import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import MyOrders from "@/pages/MyOrders";
import Checkout from "@/pages/Checkout";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminOrders from "@/pages/AdminOrders";
import AdminMenu from "@/pages/AdminMenu";
import AdminInventory from "@/pages/AdminInventory";

function Router() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/:rest*">
            {() => {
              window.location.href = "/api/login";
              return null;
            }}
          </Route>
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/menu" component={Home} />
          <Route path="/my-orders" component={MyOrders} />
          <Route path="/checkout" component={Checkout} />
          {isAdmin && (
            <>
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/admin/orders" component={AdminOrders} />
              <Route path="/admin/menu" component={AdminMenu} />
              <Route path="/admin/inventory" component={AdminInventory} />
            </>
          )}
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
