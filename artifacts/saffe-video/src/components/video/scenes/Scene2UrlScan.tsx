import { motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene2UrlScan() {
  const [typedUrl, setTypedUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const targetUrl = 'https://myapp.example.com';

  useEffect(() => {
    // Type URL
    let currentText = '';
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < targetUrl.length) {
        currentText += targetUrl.charAt(i);
        setTypedUrl(currentText);
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);

    // Progress bar
    const progTimer = setTimeout(() => {
      let p = 0;
      const pInt = setInterval(() => {
        p += 2;
        if (p <= 100) {
          setProgress(p);
        } else {
          clearInterval(pInt);
          setShowResults(true);
        }
      }, 30);
      return () => clearInterval(pInt);
    }, 2500);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(progTimer);
    };
  }, []);

  const vulns = [
    { title: 'Cross-Site Scripting (XSS)', type: 'High', color: 'var(--color-danger)' },
    { title: 'SQL Injection', type: 'Critical', color: 'var(--color-danger)' },
    { title: 'Exposed .env file', type: 'Critical', color: 'var(--color-danger)' },
    { title: 'Missing CSRF Token', type: 'Medium', color: 'var(--color-warning)' },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10 px-[10vw] overflow-hidden"
      {...sceneTransitions.clipPolygon}
    >
      <div className="w-[70vw] glass-panel rounded-2xl p-[3vw] shadow-2xl flex flex-col gap-[2vw]">
        
        {/* Input */}
        <motion.div 
          className="bg-[var(--color-primary)] border border-[var(--color-border)] rounded-xl p-[1.5vw] flex items-center gap-[1vw]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="w-3 h-3 rounded-full bg-[var(--color-text-secondary)] opacity-50" />
          <span className="font-mono text-[1.5vw] text-[var(--color-text-primary)]">
            {typedUrl}
            <motion.span 
              animate={{ opacity: [1, 0, 1] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
            >|</motion.span>
          </span>
        </motion.div>

        {/* Progress */}
        {typedUrl === targetUrl && !showResults && (
          <motion.div 
            className="flex flex-col gap-[1vw]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="flex justify-between font-body text-[1.2vw] text-[var(--color-text-secondary)]">
              <span>Scanning architecture...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-[var(--color-primary)] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[var(--color-accent)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Results */}
        {showResults && (
          <motion.div 
            className="flex flex-col gap-[2vw]"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            } as Variants}
          >
            <motion.div 
              variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
              className="flex justify-between items-end"
            >
              <div>
                <h3 className="font-display font-semibold text-[2.5vw]">Scan Complete</h3>
                <p className="font-body text-[1.2vw] text-[var(--color-text-secondary)]">Found 4 vulnerabilities</p>
              </div>
              <motion.div 
                className="bg-[rgba(255,59,48,0.1)] text-[var(--color-danger)] border border-[rgba(255,59,48,0.2)] px-[1.5vw] py-[0.5vw] rounded-lg font-display font-bold flex flex-col items-center"
                animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 0 rgba(255,59,48,0)', '0 0 20px rgba(255,59,48,0.3)', '0 0 0 rgba(255,59,48,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-[1vw] uppercase tracking-wider opacity-80">Risk Score</span>
                <span className="text-[2.5vw] leading-none">8.7</span>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-2 gap-[1vw]">
              {vulns.map((v, i) => (
                <motion.div 
                  key={i}
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 20 } } } as Variants}
                  className="bg-[var(--color-primary)] border border-[var(--color-border)] p-[1.2vw] rounded-lg flex justify-between items-center"
                >
                  <span className="font-body text-[1.1vw]">{v.title}</span>
                  <div className="flex items-center gap-[0.5vw]">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                    <span className="font-body text-[0.9vw] text-[var(--color-text-secondary)]">{v.type}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="mt-[1vw] bg-[rgba(0,113,227,0.08)] border border-[rgba(0,113,227,0.25)] rounded-xl overflow-hidden"
            >
              <div className="flex items-center gap-[1vw] px-[1.5vw] pt-[1.2vw] pb-[0.8vw] border-b border-[rgba(0,113,227,0.15)]">
                <div className="w-[2.5vw] h-[2.5vw] rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow-[0_0_15px_rgba(0,113,227,0.5)]">
                  <span className="text-white text-[1.2vw]">✨</span>
                </div>
                <div>
                  <div className="font-display font-semibold text-[1.2vw] text-[var(--color-accent)]">AI Vibe Prompt — Copy &amp; Paste Fix</div>
                  <div className="font-body text-[0.9vw] text-[var(--color-text-secondary)]">Gemini-generated prompt for all critical issues</div>
                </div>
              </div>
              <div className="px-[1.5vw] py-[1vw] font-mono text-[0.85vw] text-[var(--color-text-primary)] opacity-90 leading-relaxed">
                <span className="text-[var(--color-accent)]">You are a security expert.</span> Fix the following vulnerabilities in <span className="text-[var(--color-success)]">myapp.example.com</span>: <span className="text-[var(--color-warning)]">[XSS]</span> sanitize user inputs in form handlers, <span className="text-[var(--color-danger)]">[SQL Injection]</span> use parameterized queries in all DB calls, <span className="text-[var(--color-danger)]">[.env Exposed]</span> add .env to .gitignore and rotate secrets. Return patched code with comments.
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
