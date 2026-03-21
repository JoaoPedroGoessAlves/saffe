import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  CheckCircle2, XCircle, AlertTriangle, Info, 
  ChevronDown, Copy, ShieldAlert, Mail, ArrowLeft, Loader2, Sparkles
} from "lucide-react";

import { useGetScan } from "@workspace/api-client-react";
import { useSaffeSendReport } from "@/hooks/use-scans";
import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ScanReport() {
  const { scanId } = useParams<{ scanId: string }>();
  
  // Poll every 2 seconds if status is not completed/failed
  const { data: scan, isLoading, error } = useGetScan(scanId || "", {
    query: {
      refetchInterval: (query) => {
        const state = query.state.data;
        if (state?.status === 'completed' || state?.status === 'failed') return false;
        return 2000;
      }
    }
  });

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-bold">Loading Report...</h2>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !scan) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
            <h2 className="text-2xl font-bold text-destructive mb-2">Scan Not Found</h2>
            <p className="text-muted-foreground mb-6">We couldn't find the requested scan report.</p>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const isRunning = scan.status === "pending" || scan.status === "running";

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background pb-20">
        <Navbar />
        
        <main className="container max-w-5xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Scans
            </Link>
          </div>

          {isRunning ? (
            <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-lg">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                <SearchAnimation className="absolute inset-0 m-auto w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-3">Scanning your application</h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                We are currently analyzing <span className="font-semibold text-foreground">{scan.url}</span>. 
                This usually takes a few seconds.
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-muted rounded-full text-sm font-medium animate-pulse">
                Running checks...
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header Summary */}
              <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-lg mb-8 relative overflow-hidden">
                {/* Background wash based on risk level */}
                <div className={cn(
                  "absolute inset-0 opacity-5",
                  scan.riskLevel === 'critical' ? "bg-red-500" :
                  scan.riskLevel === 'high' ? "bg-orange-500" :
                  scan.riskLevel === 'medium' ? "bg-yellow-500" :
                  scan.riskLevel === 'low' ? "bg-green-500" : "bg-muted"
                )} />

                <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl md:text-3xl font-display font-bold truncate max-w-[600px]" title={scan.url}>
                        {scan.domain}
                      </h1>
                    </div>
                    <p className="text-muted-foreground mb-6 flex items-center gap-2">
                      Scanned on {format(new Date(scan.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <EmailReportDialog scanId={scan.id} />
                      <Link href="/scan/new">
                        <Button variant="outline" className="rounded-full shadow-sm hover-elevate">
                          Run New Scan
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
                    <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Overall Risk Score</p>
                    <SeverityBadge level={scan.riskLevel} size="lg" className="text-xl px-6 py-2 shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Encouraging Message if good, Warning if bad */}
              {scan.riskLevel === 'critical' || scan.riskLevel === 'high' ? (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 p-5 rounded-2xl mb-8 flex gap-4 text-red-900 dark:text-red-300 shadow-sm">
                  <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Action Required</h3>
                    <p className="opacity-90">We found severe vulnerabilities that could let attackers compromise your app or users. Please fix these immediately using the provided AI prompts.</p>
                  </div>
                </div>
              ) : scan.riskLevel === 'low' ? (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/50 p-5 rounded-2xl mb-8 flex gap-4 text-green-900 dark:text-green-300 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Great Job!</h3>
                    <p className="opacity-90">Your application's security posture looks solid. No major vulnerabilities were detected in the public configuration.</p>
                  </div>
                </div>
              ) : null}

              {/* Results List */}
              <div className="space-y-6">
                <h3 className="text-2xl font-display font-bold">Detailed Analysis</h3>
                
                {scan.results?.map((result, i) => (
                  <motion.div 
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <ResultCard result={result} />
                  </motion.div>
                ))}

                {(!scan.results || scan.results.length === 0) && scan.status === 'completed' && (
                  <div className="text-center py-12 text-muted-foreground border rounded-2xl bg-muted/20">
                    No results data available.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function ResultCard({ result }: { result: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const isPass = result.passed;
  
  const Icon = isPass ? CheckCircle2 : 
               result.severity === 'critical' || result.severity === 'high' ? XCircle :
               result.severity === 'medium' ? AlertTriangle : Info;

  const iconColorClass = isPass ? "text-success" :
                         result.severity === 'critical' ? "text-red-500" :
                         result.severity === 'high' ? "text-orange-500" :
                         result.severity === 'medium' ? "text-yellow-500" : "text-blue-500";

  const borderColorClass = isPass ? "border-border" :
                           result.severity === 'critical' ? "border-red-200 dark:border-red-900/50 shadow-red-500/10" :
                           result.severity === 'high' ? "border-orange-200 dark:border-orange-900/50 shadow-orange-500/10" :
                           result.severity === 'medium' ? "border-yellow-200 dark:border-yellow-900/50 shadow-yellow-500/10" : "border-border";

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (result.vibePrompt) {
      navigator.clipboard.writeText(result.vibePrompt);
      setCopied(true);
      toast({ description: "Prompt copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md", borderColorClass, !isPass && "bg-card/95")}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-5 flex items-start gap-4 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className={cn("mt-1", iconColorClass)}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                <h4 className="font-bold text-lg leading-tight">{result.title}</h4>
                <div className="flex items-center gap-3">
                  {!isPass && <SeverityBadge level={result.severity} />}
                  <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} />
                </div>
              </div>
              <p className="text-muted-foreground">{result.description}</p>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-5 pb-5 pt-2 ml-10 border-t border-border/50">
            {result.details && (
              <div className="mb-4 mt-4">
                <h5 className="font-semibold text-sm mb-2 text-foreground">Why it matters:</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.details}</p>
              </div>
            )}
            
            {!isPass && result.fixSuggestion && (
              <div className="mb-4">
                <h5 className="font-semibold text-sm mb-2 text-foreground">How to fix it:</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.fixSuggestion}</p>
              </div>
            )}

            {!isPass && result.vibePrompt && (
              <div className="mt-6 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden shadow-inner">
                <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    AI Prompt (Lovable / Bolt / Cursor)
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800"
                    onClick={handleCopy}
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-success" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                    {copied ? "Copied!" : "Copy Prompt"}
                  </Button>
                </div>
                <div className="p-4 text-sm font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {result.vibePrompt}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function EmailReportDialog({ scanId }: { scanId: string }) {
  const [open, setOpen] = useState(false);
  const sendEmail = useSaffeSendReport();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof emailSchema>) {
    try {
      await sendEmail.mutateAsync({ scanId, data: { email: values.email } });
      setOpen(false);
      form.reset();
    } catch (e) {
      // handled by hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-sm hover-elevate active-elevate-2 bg-foreground text-background hover:bg-foreground/90">
          <Mail className="w-4 h-4 mr-2" />
          Email Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Security Report</DialogTitle>
          <DialogDescription>
            Send a comprehensive HTML version of this report to your email, including a technical section for developers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="founder@startup.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={sendEmail.isPending} className="hover-elevate active-elevate-2">
                {sendEmail.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Send Report
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Just a simple animated icon for the loading state
function SearchAnimation(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}
