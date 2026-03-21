import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ShieldCheck, Loader2 } from "lucide-react";

interface UrlScanAnimationProps {
  progress?: number;
  onComplete?: () => void;
}

const checks = [
  { id: "ssl", label: "SSL/TLS Certificate" },
  { id: "cors", label: "CORS Policy" },
  { id: "headers", label: "Security Headers" },
  { id: "dns", label: "DNS Records" },
  { id: "ports", label: "Open Ports" },
];

export function UrlScanAnimation({ progress = 0, onComplete }: UrlScanAnimationProps) {
  const [visibleChecks, setVisibleChecks] = useState<string[]>([]);
  const [completedChecks, setCompletedChecks] = useState<string[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    checks.forEach((check, i) => {
      const showDelay = 800 + i * 900;
      const completeDelay = showDelay + 600;

      const t1 = setTimeout(() => {
        setVisibleChecks((prev) => [...prev, check.id]);
      }, showDelay);
      timeoutsRef.current.push(t1);

      const t2 = setTimeout(() => {
        setCompletedChecks((prev) => [...prev, check.id]);
        if (i === checks.length - 1 && onComplete) {
          const t3 = setTimeout(onComplete, 400);
          timeoutsRef.current.push(t3);
        }
      }, completeDelay);
      timeoutsRef.current.push(t2);
    });

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [onComplete]);

  const progressFraction = Math.min(Math.max(progress / 100, 0), 1);
  const progressVisibleCount = Math.round(progressFraction * checks.length);
  const progressCompletedCount = Math.max(0, progressVisibleCount - 1);

  const effectiveVisible = new Set([
    ...visibleChecks,
    ...checks.slice(0, progressVisibleCount).map((c) => c.id),
  ]);
  const effectiveCompleted = new Set([
    ...completedChecks,
    ...checks.slice(0, progressCompletedCount).map((c) => c.id),
  ]);

  return (
    <div className="w-full max-w-md mx-auto py-8 space-y-8">
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28 mb-6">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/40" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="w-10 h-10 text-primary" />
          </div>
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-primary/70" />
          </motion.div>
        </div>

        <motion.div
          className="relative w-full h-1.5 bg-muted rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {progress > 0 ? (
            <motion.div
              className="absolute inset-y-0 left-0 bg-primary rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ) : (
            <motion.div
              className="absolute inset-y-0 left-0 bg-primary rounded-full"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "40%" }}
            />
          )}
        </motion.div>

        <motion.p
          className="mt-3 text-sm text-muted-foreground font-medium"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scanning domain...
        </motion.p>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {checks.map((check) =>
            effectiveVisible.has(check.id) ? (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/60"
              >
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {effectiveCompleted.has(check.id) ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </motion.div>
                  ) : (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    effectiveCompleted.has(check.id) ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {check.label}
                </span>
                {effectiveCompleted.has(check.id) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-auto text-xs text-emerald-500 font-semibold"
                  >
                    Done
                  </motion.span>
                )}
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
