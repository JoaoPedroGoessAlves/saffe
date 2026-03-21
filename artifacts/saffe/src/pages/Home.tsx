import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { SiriButton } from "@/components/ui/siri-button";
import { ShieldCheck, Lock, Search, FileCode2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { isAuthenticated, login } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const handleCTA = () => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    } else {
      login();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img
              src={`${import.meta.env.BASE_URL}images/hero-mesh.png`}
              alt={t("home.mockBgAlt")}
              className="w-full h-full object-cover opacity-[0.15] dark:opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
          </div>

          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium text-sm mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                {t("home.badge")}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-foreground leading-[1.1] mb-6"
              >
                {t("home.heroTitle1")} <br className="hidden md:block" />
                <span className="text-gradient">{t("home.heroTitle2")}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                {t("home.heroSubtitle")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <SiriButton
                  size="lg"
                  onClick={handleCTA}
                  className="rounded-full px-8 py-6 text-lg font-semibold hover-elevate active-elevate-2 shadow-xl shadow-primary/20 w-full sm:w-auto"
                >
                  {t("home.ctaButton")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </SiriButton>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 sm:mt-0">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  {t("home.noCreditCard")}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features / How it works */}
        <section className="py-24 bg-muted/50 border-y border-border/50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">{t("home.howTitle")}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t("home.howSubtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Lock className="w-8 h-8 text-primary" />,
                  title: t("home.step1Title"),
                  desc: t("home.step1Desc"),
                },
                {
                  icon: <Search className="w-8 h-8 text-accent" />,
                  title: t("home.step2Title"),
                  desc: t("home.step2Desc"),
                },
                {
                  icon: <FileCode2 className="w-8 h-8 text-success" />,
                  title: t("home.step3Title"),
                  desc: t("home.step3Desc"),
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-card p-8 rounded-3xl border border-border shadow-lg shadow-black/5 hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="bg-background w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-border/50">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What we check */}
        <section className="py-24">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  {t("home.checkTitle")}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {t("home.checkSubtitle")}
                </p>

                <ul className="space-y-4">
                  {[
                    t("home.check1"),
                    t("home.check2"),
                    t("home.check3"),
                    t("home.check4"),
                    t("home.check5"),
                    t("home.check6"),
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 bg-success/20 p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <span className="font-medium text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl rounded-[3rem] -z-10" />
                <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                  <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="ml-4 text-xs font-mono text-muted-foreground">saffe-report.html</div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold text-lg">{t("home.mockScanTitle")}</h4>
                      <div className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-xs font-bold border border-red-200">{t("home.mockCriticalRisk")}</div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 border border-red-200 bg-red-50/50 dark:bg-red-900/10 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="w-5 h-5 text-red-500" />
                          <h5 className="font-semibold text-red-900 dark:text-red-300">{t("home.mockExposedKey")}</h5>
                        </div>
                        <p className="text-sm text-red-800/80 dark:text-red-400/80 mb-3">{t("home.mockExposedKeyDesc")}</p>
                        <div className="bg-black/90 p-3 rounded-lg flex justify-between items-center">
                          <code className="text-xs text-green-400 font-mono">{t("home.mockPromptSnippet")}</code>
                          <Button size="sm" variant="secondary" className="h-7 text-xs">{t("home.mockCopyBtn")}</Button>
                        </div>
                      </div>

                      <div className="p-4 border border-orange-200 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="w-5 h-5 text-orange-500" />
                          <h5 className="font-semibold text-orange-900 dark:text-orange-300">{t("home.mockOpenCors")}</h5>
                        </div>
                        <p className="text-sm text-orange-800/80 dark:text-orange-400/80">{t("home.mockOpenCorsDesc")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t border-border py-12">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-xl text-foreground">Saffe</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Saffe. {t("home.footerTagline")}
          </p>
        </div>
      </footer>
    </div>
  );
}
