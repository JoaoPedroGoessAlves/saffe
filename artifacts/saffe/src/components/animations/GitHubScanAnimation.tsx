import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, FileCode, Folder, CheckCircle2, Loader2 } from "lucide-react";

interface GitHubScanAnimationProps {
  progress?: number;
  onComplete?: () => void;
}

const fileTree = [
  { id: "root", label: "repository", type: "folder", depth: 0 },
  { id: "src", label: "src/", type: "folder", depth: 1 },
  { id: "auth", label: "auth.ts", type: "file", depth: 2 },
  { id: "config", label: "config.env", type: "file", depth: 2 },
  { id: "deps", label: "package.json", type: "file", depth: 1 },
  { id: "lock", label: "package-lock.json", type: "file", depth: 1 },
  { id: "ci", label: ".github/workflows/", type: "folder", depth: 1 },
];

const codeLines = [
  "const apiKey = process.env.SECRET_KEY;",
  'import { exec } from "child_process";',
  "dependencies: { lodash: \"^4.17.21\" }",
  "eval(userInput); // ⚠",
  "fs.readFileSync('/etc/passwd');",
  "crypto.createHash('md5').update(data);",
];

const categories = [
  { id: "secrets", label: "Secrets Detection", color: "bg-rose-500" },
  { id: "deps", label: "Dependency Analysis", color: "bg-amber-500" },
  { id: "quality", label: "Code Quality", color: "bg-primary" },
];

export function GitHubScanAnimation({ progress = 0, onComplete }: GitHubScanAnimationProps) {
  const [litNodes, setLitNodes] = useState<string[]>([]);
  const [codeIndex, setCodeIndex] = useState(0);
  const [barWidths, setBarWidths] = useState<Record<string, number>>({});
  const [doneCategories, setDoneCategories] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    fileTree.forEach((node, i) => {
      const t = setTimeout(() => {
        setLitNodes((prev) => [...prev, node.id]);
      }, i * 400);
      timeoutsRef.current.push(t);
    });

    intervalRef.current = setInterval(() => {
      setCodeIndex((prev) => (prev + 1) % codeLines.length);
    }, 700);

    categories.forEach((cat, i) => {
      const delay = 1200 + i * 1000;
      const t1 = setTimeout(() => {
        const target = 40 + Math.floor(Math.random() * 55);
        setBarWidths((prev) => ({ ...prev, [cat.id]: target }));
      }, delay);
      timeoutsRef.current.push(t1);

      const t2 = setTimeout(() => {
        setDoneCategories((prev) => [...prev, cat.id]);
        if (i === categories.length - 1 && onComplete) {
          const t3 = setTimeout(onComplete, 500);
          timeoutsRef.current.push(t3);
        }
      }, delay + 700);
      timeoutsRef.current.push(t2);
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [onComplete]);

  const progressFraction = Math.min(Math.max(progress / 100, 0), 1);
  const litCount = Math.max(
    litNodes.length,
    Math.round(progressFraction * fileTree.length)
  );
  const effectiveLitNodes = fileTree.slice(0, litCount).map((n) => n.id);

  return (
    <div className="w-full max-w-md mx-auto py-8 space-y-6">
      <div className="flex flex-col items-center mb-2">
        <motion.div
          className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-primary/10 mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Github className="w-8 h-8 text-primary" />
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
          Traversing repository...
        </motion.p>
      </div>

      <div className="bg-card border border-border/60 rounded-xl p-4">
        <div className="space-y-1">
          {fileTree.map((node) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: effectiveLitNodes.includes(node.id) ? 1 : 0.2 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 py-0.5"
              style={{ paddingLeft: `${node.depth * 14}px` }}
            >
              {node.type === "folder" ? (
                <Folder className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              ) : (
                <FileCode className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              )}
              <span
                className={`text-xs font-mono transition-colors duration-300 ${
                  effectiveLitNodes.includes(node.id) ? "text-foreground" : "text-muted-foreground/50"
                }`}
              >
                {node.label}
              </span>
              {effectiveLitNodes.includes(node.id) && node.id !== "root" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-hidden">
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
          <span className="ml-2 text-xs text-zinc-500 font-mono">analysis.log</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={codeIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-xs font-mono text-emerald-400 truncate"
          >
            <span className="text-zinc-500 select-none mr-2">&gt;</span>
            {codeLines[codeIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="space-y-3">
        {categories.map((cat, i) => {
          const catProgressThreshold = (i + 1) / categories.length;
          const catActive = progressFraction >= catProgressThreshold * 0.5 || doneCategories.includes(cat.id);
          const catDone = progressFraction >= catProgressThreshold || doneCategories.includes(cat.id);
          const barPct = barWidths[cat.id] ?? (catActive ? Math.round(progressFraction * 80) : 0);

          return (
            <div key={cat.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  {catDone ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />
                    </motion.span>
                  ) : (
                    <Loader2 className="w-4 h-4 text-primary animate-spin inline" />
                  )}
                  {cat.label}
                </span>
                {catDone && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-emerald-500 font-semibold"
                  >
                    Complete
                  </motion.span>
                )}
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${cat.color}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${barPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
