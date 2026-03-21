import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene3DeepScan() {
  const [typedRepo, setTypedRepo] = useState('');
  const [filesCount, setFilesCount] = useState(0);
  const [showCode, setShowCode] = useState(false);
  
  const targetRepo = 'github.com/company/backend';

  useEffect(() => {
    let currentText = '';
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < targetRepo.length) {
        currentText += targetRepo.charAt(i);
        setTypedRepo(currentText);
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 40);

    const scanTimer = setTimeout(() => {
      let f = 0;
      const fInt = setInterval(() => {
        f += 13;
        if (f <= 247) {
          setFilesCount(f);
        } else {
          setFilesCount(247);
          clearInterval(fInt);
          setTimeout(() => setShowCode(true), 500);
        }
      }, 50);
      return () => clearInterval(fInt);
    }, 2000);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(scanTimer);
    };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10 px-[10vw] overflow-hidden"
      {...sceneTransitions.slideUp}
    >
      <div className="w-[80vw] h-[70vh] flex gap-[2vw]">
        {/* Left Column */}
        <div className="w-[30%] flex flex-col gap-[2vw]">
          <motion.div 
            className="glass-panel p-[2vw] rounded-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="font-display text-[1.2vw] text-[var(--color-text-secondary)] mb-[1vw]">Target Repository</div>
            <div className="font-mono text-[1.1vw] bg-[var(--color-primary)] p-[1vw] rounded border border-[var(--color-border)] text-[var(--color-accent)]">
              {typedRepo}
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>_</motion.span>
            </div>
            
            {typedRepo === targetRepo && (
              <motion.div 
                className="mt-[2vw]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex justify-between items-end mb-[0.5vw]">
                  <span className="font-body text-[1vw] text-[var(--color-text-secondary)]">Analyzing files...</span>
                  <span className="font-mono text-[1.5vw] text-[var(--color-text-primary)]">{filesCount}/247</span>
                </div>
                <div className="h-1 bg-[var(--color-primary)] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[var(--color-accent)]"
                    style={{ width: `${(filesCount / 247) * 100}%` }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          {showCode && (
            <motion.div 
              className="glass-panel p-[2vw] rounded-2xl flex-1 flex flex-col justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="font-display font-semibold text-[3vw] text-[var(--color-danger)] leading-none mb-[1vw]">2 Critical</div>
              <div className="font-body text-[1.2vw] text-[var(--color-text-secondary)]">8 High • 15 Medium</div>
              <div className="mt-[2vw] inline-flex items-center gap-[0.5vw] bg-[rgba(255,255,255,0.05)] px-[1vw] py-[0.5vw] rounded-full border border-[var(--color-border)]">
                <span className="text-[1vw]">✨</span>
                <span className="font-body text-[0.9vw] text-[var(--color-text-primary)]">Powered by Gemini AI</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column - Code */}
        <motion.div 
          className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-[var(--color-primary)] border-b border-[var(--color-border)] px-[2vw] py-[1vw] flex items-center gap-[1vw]">
            <div className="flex gap-[0.5vw]">
              <div className="w-3 h-3 rounded-full bg-[var(--color-danger)]" />
              <div className="w-3 h-3 rounded-full bg-[var(--color-warning)]" />
              <div className="w-3 h-3 rounded-full bg-[var(--color-success)]" />
            </div>
            <div className="font-mono text-[1vw] text-[var(--color-text-secondary)] ml-[1vw]">src/auth/jwt.ts</div>
          </div>
          
          <div className="p-[2vw] font-mono text-[1.1vw] leading-[2] relative flex-1">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: showCode ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-[var(--color-text-secondary)]">12 | const token = jwt.sign(</div>
              <div className="text-[var(--color-text-secondary)]">13 |   {"{ user_id: user.id }"},</div>
              
              <div className="relative my-[0.5vw]">
                <motion.div 
                  className="absolute inset-0 bg-[rgba(255,59,48,0.15)] border-l-[4px] border-[var(--color-danger)] -mx-[2vw] px-[2vw]"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={showCode ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
                <div className="relative z-10 flex">
                  <span className="text-[var(--color-danger)] mr-[1vw]">14 |</span>
                  <span className="text-[var(--color-text-primary)]">  process.env.JWT_SECRET || 'dev_secret_key',</span>
                </div>
              </div>
              
              <div className="text-[var(--color-text-secondary)]">15 |   {"{ expiresIn: '24h' }"}</div>
              <div className="text-[var(--color-text-secondary)]">16 | );</div>

              <motion.div 
                className="absolute right-[2vw] top-[6vw] w-[25vw] bg-[var(--color-primary)] border border-[rgba(255,59,48,0.5)] rounded-lg p-[1.5vw] shadow-2xl"
                initial={{ opacity: 0, x: 50 }}
                animate={showCode ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ type: 'spring', damping: 15, delay: 1 }}
              >
                <div className="flex items-center gap-[0.5vw] mb-[1vw]">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-danger)]" />
                  <span className="font-display font-bold text-[1vw] text-[var(--color-danger)]">Hardcoded Secret</span>
                </div>
                <div className="font-body text-[0.9vw] text-[var(--color-text-secondary)] mb-[1.5vw]">
                  Fallback to hardcoded secret allows attackers to forge JWT tokens if environment variable is missing.
                </div>
                <div className="pointer-events-none bg-[var(--color-accent)] text-white w-full py-[0.8vw] rounded font-body text-[0.9vw] font-medium flex items-center justify-center gap-[0.5vw]">
                  <span>✨</span> Fix with Gemini
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
