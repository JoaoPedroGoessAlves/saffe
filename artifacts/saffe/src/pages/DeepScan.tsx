import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Github, ArrowRight, Shield, Code2, Lock, AlertTriangle } from "lucide-react";
import { useCreateJulesScan } from "@/hooks/use-jules";
import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const CHECKS = [
  { icon: Lock, label: "Segredos e credenciais expostos" },
  { icon: AlertTriangle, label: "Injeção de SQL e XSS" },
  { icon: Shield, label: "Autenticação e controle de acesso" },
  { icon: Code2, label: "Configurações inseguras no código" },
];

export default function DeepScan() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <DeepScanForm />
        </main>
      </div>
    </ProtectedRoute>
  );
}

function DeepScanForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const [, navigate] = useLocation();
  const createScan = useCreateJulesScan();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    const result = await createScan.mutateAsync(repoUrl.trim());
    navigate(`/deep-scan/${result.id}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
          <Github className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground mb-3">
          Deep Code Scan
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          O Jules analisa seu repositório GitHub e identifica vulnerabilidades
          diretamente no código-fonte — muito além do que um scan de URL consegue detectar.
        </p>
      </div>

      <Card className="shadow-lg border-border/60">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="repoUrl" className="text-sm font-semibold">
                URL do Repositório GitHub
              </Label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="repoUrl"
                  type="url"
                  placeholder="https://github.com/seu-usuario/seu-repositorio"
                  className="pl-10 h-12 text-base"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  required
                  disabled={createScan.isPending}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Apenas repositórios públicos são suportados no momento.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 rounded-xl font-semibold text-base"
              disabled={createScan.isPending || !repoUrl.trim()}
            >
              {createScan.isPending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Iniciando análise...
                </>
              ) : (
                <>
                  Analisar com Jules
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {CHECKS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 text-sm text-muted-foreground"
          >
            <Icon className="w-4 h-4 text-primary shrink-0" />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        A análise do Jules pode levar alguns minutos dependendo do tamanho do repositório.
      </p>
    </motion.div>
  );
}
