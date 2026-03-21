import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useSystemTheme } from "@/hooks/use-system-theme";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import NewScan from "@/pages/NewScan";
import ScanReport from "@/pages/ScanReport";
import CostEstimator from "@/pages/CostEstimator";
import CostAnalysisResult from "@/pages/CostAnalysisResult";
import DeepScan from "@/pages/DeepScan";
import DeepScanResult from "@/pages/DeepScanResult";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/scan/new" component={NewScan} />
      <Route path="/scan/:scanId" component={ScanReport} />
      <Route path="/cost-estimator" component={CostEstimator} />
      <Route path="/cost-analysis/:analysisId" component={CostAnalysisResult} />
      <Route path="/deep-scan" component={DeepScan} />
      <Route path="/deep-scan/:id" component={DeepScanResult} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useSystemTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
