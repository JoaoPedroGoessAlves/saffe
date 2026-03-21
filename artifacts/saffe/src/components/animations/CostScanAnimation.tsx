import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Code2, CheckCircle2 } from "lucide-react";

interface CostScanAnimationProps {
  progress?: number;
  onComplete?: () => void;
}

const languages = [
  { id: "ts", label: "TypeScript", color: "bg-blue-500", maxPct: 42 },
  { id: "py", label: "Python", color: "bg-yellow-500", maxPct: 28 },
  { id: "go", label: "Go", color: "bg-cyan-500", maxPct: 18 },
  { id: "css", label: "CSS/SCSS", color: "bg-purple-500", maxPct: 12 },
];

const TARGET_LINES = 148_274;
const TARGET_COST = 284_600;

function useCountUp(target: number, duration: number, delay: number = 0, externalProgress?: number) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (externalProgress !== undefined && externalProgress > 0) {
      setValue(Math.round((externalProgress / 100) * target));
      return;
    }

    timeoutRef.current = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.floor(eased * target));
        if (t < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          setValue(target);
        }
      };
      frameRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, delay, externalProgress]);

  return value;
}

export function CostScanAnimation({ progress = 0, onComplete }: CostScanAnimationProps) {
  const [langWidths, setLangWidths] = useState<Record<string, number>>({});
  const [showCost, setShowCost] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const hasRealProgress = progress > 0;
  const linesCount = useCountUp(TARGET_LINES, 3200, 200, hasRealProgress ? progress : undefined);
  const costValue = useCountUp(showCost || hasRealProgress ? TARGET_COST : 0, 2000, 0, hasRealProgress && progress >= 80 ? progress : undefined);

  useEffect(() => {
    if (hasRealProgress) {
      const fraction = progress / 100;
      languages.forEach((lang) => {
        setLangWidths((prev) => ({ ...prev, [lang.id]: Math.round(fraction * lang.maxPct) }));
      });
      if (progress >= 80) setShowCost(true);
      if (progress >= 100) {
        setIsDone(true);
        if (onComplete) onComplete();
      }
      return;
    }

    languages.forEach((lang, i) => {
      const t = setTimeout(() => {
        setLangWidths((prev) => ({ ...prev, [lang.id]: lang.maxPct }));
      }, 800 + i * 500);
      timeoutsRef.current.push(t);
    });

    const t1 = setTimeout(() => setShowCost(true), 3400);
    timeoutsRef.current.push(t1);

    const t2 = setTimeout(() => {
      setIsDone(true);
      if (onComplete) onComplete();
    }, 5600);
    timeoutsRef.current.push(t2);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [progress, hasRealProgress, onComplete]);

  return (
    <div className="w-full max-w-md mx-auto py-8 space-y-6">
      <div className="flex flex-col items-center mb-2">
        <motion.div
          className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-primary/10 mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Code2 className="w-8 h-8 text-primary" />
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary/30"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <motion.p
          className="text-sm text-muted-foreground font-medium"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Counting lines of code...
        </motion.p>
      </div>

      <div className="bg-card border border-border/60 rounded-xl p-5 flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">Lines of Code</span>
        <motion.span className="text-2xl font-bold font-mono text-foreground tabular-nums">
          {linesCount.toLocaleString()}
        </motion.span>
      </div>

      <div className="bg-card border border-border/60 rounded-xl p-5 space-y-3">
        <p className="text-sm font-semibold text-foreground mb-4">Language Breakdown</p>
        {languages.map((lang) => (
          <div key={lang.id} className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="font-medium">{lang.label}</span>
              <span>{langWidths[lang.id] ?? 0}%</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${lang.color}`}
                initial={{ width: "0%" }}
                animate={{ width: `${langWidths[lang.id] ?? 0}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showCost && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border/60 rounded-xl p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">Estimated Cost (COCOMO II)</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.span className="text-2xl font-bold font-mono text-primary tabular-nums">
                ${costValue.toLocaleString()}
              </motion.span>
              {isDone && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
