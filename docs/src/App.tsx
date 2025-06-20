import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/index";
import TroubleshootPage from "@/pages/docs/trouboleshoot";
import IntroductionPage from "@/pages/docs/introduction";
import ProjectOverviewPage from "@/pages/docs/overview";
import RewardPage from "./pages/docs/reward";
import FAQPage from "./pages/docs/faq";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/introduction" component={IntroductionPage} />
      <Route path="/overview" component={ProjectOverviewPage} />
      <Route path="/rewards" component={RewardPage} />
      <Route path="/troubleshoot" component={TroubleshootPage} />
      <Route path="/faq" component={FAQPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
