import { Link } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/ui/language-selector";
import { ShieldCheck, LogOut, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navbar() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass-panel">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">Saffe</span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 ml-6">
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-md hover:bg-muted transition-colors">
                {t("nav.dashboard")}
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />

          {!isLoading && (
            <>
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link href="/scan/new" className="hidden sm:block">
                    <Button size="sm" className="gap-2 rounded-full hover-elevate active-elevate-2">
                      <Search className="w-4 h-4" />
                      {t("nav.newScan")}
                    </Button>
                  </Link>

                  <div className="flex items-center gap-3 pl-4 border-l border-border/50">
                    <Avatar className="w-8 h-8 border border-border/50">
                      <AvatarImage src={user?.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-primary/5 text-primary text-xs">
                        {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive" title={t("nav.logOut")}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={login} className="rounded-full px-6 hover-elevate active-elevate-2 bg-foreground text-background hover:bg-foreground/90">
                  {t("nav.signIn")}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
