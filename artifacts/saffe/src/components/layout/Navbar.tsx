import { Link } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/ui/language-selector";
import { ShieldCheck, LogOut, Search, Palette } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUIStyle, type UIStyle } from "@/contexts/UIStyleContext";
import { useState, useRef, useEffect } from "react";

const styleOptions: { value: UIStyle; label: string; preview: string }[] = [
  {
    value: "default",
    label: "Default",
    preview: "linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)",
  },
  {
    value: "vercel",
    label: "Vercel",
    preview: "linear-gradient(135deg, #000 0%, #111 50%, #0072F5 100%)",
  },
  {
    value: "apple",
    label: "Apple",
    preview: "linear-gradient(135deg, #fff 0%, #f5f5f7 50%, #0071E3 100%)",
  },
];

export function Navbar() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const { t } = useLanguage();
  const { uiStyle, setUIStyle } = useUIStyle();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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

          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen((v) => !v)}
              title="Change UI style"
              className="text-muted-foreground"
            >
              <Palette className="w-4 h-4" />
            </Button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-border bg-popover shadow-xl overflow-hidden z-50">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                  UI Style
                </div>
                {styleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setUIStyle(opt.value); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-muted ${uiStyle === opt.value ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-border/60 shrink-0"
                      style={{ background: opt.preview }}
                    />
                    {opt.label}
                    {uiStyle === opt.value && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

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
