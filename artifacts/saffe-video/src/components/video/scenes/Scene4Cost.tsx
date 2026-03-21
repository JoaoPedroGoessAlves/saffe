import { motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene4Cost() {
  const [cost, setCost] = useState(0);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let c = 0;
      const duration = 2000;
      const start = performance.now();
      
      const animateCount = (currentTime: number) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4); // quartOut
        setCost(Math.floor(ease * 127400));
        
        if (progress < 1) {
          requestAnimationFrame(animateCount);
        } else {
          setShowStats(true);
        }
      };
      
      requestAnimationFrame(animateCount);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 px-[10vw]"
      {...sceneTransitions.morphExpand}
    >
      <div className="flex flex-col items-center">
        <motion.div 
          className="font-display font-semibold text-[2vw] text-[var(--color-accent)] mb-[2vw]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Dev Cost Estimator
        </motion.div>

        <motion.div 
          className="font-mono text-[1.5vw] text-[var(--color-text-secondary)] bg-[var(--color-secondary)] px-[2vw] py-[1vw] rounded-full border border-[var(--color-border)] mb-[4vw]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          github.com/company/monorepo
        </motion.div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="font-display font-extrabold text-[10vw] leading-none tracking-tighter text-[var(--color-text-primary)]">
            ${cost.toLocaleString()}
          </div>
          <div className="font-body text-[1.5vw] text-[var(--color-text-secondary)] mt-[1vw]">
            Estimated Development Cost (COCOMO II)
          </div>
        </motion.div>

        {showStats && (
          <motion.div 
            className="flex gap-[4vw] mt-[4vw]"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            } as Variants}
          >
            {[
              { label: 'Time Effort', val: '1,847 hrs' },
              { label: 'Codebase', val: '42,891 lines' },
              { label: 'Languages', val: '3 types' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="flex flex-col items-center"
              >
                <div className="font-display font-bold text-[2vw] text-[var(--color-text-primary)]">{stat.val}</div>
                <div className="font-body text-[1vw] text-[var(--color-text-secondary)]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {showStats && (
          <motion.div 
            className="w-full max-w-[50vw] mt-[4vw] flex flex-col gap-[1vw]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex w-full h-[1vw] rounded-full overflow-hidden">
              <motion.div className="bg-[#3178C6]" initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1, delay: 0.8 }} />
              <motion.div className="bg-[#FFD43B]" initial={{ width: 0 }} animate={{ width: '22%' }} transition={{ duration: 1, delay: 1.0 }} />
              <motion.div className="bg-[#4479A1]" initial={{ width: 0 }} animate={{ width: '10%' }} transition={{ duration: 1, delay: 1.2 }} />
            </div>
            <div className="flex justify-between font-body text-[1vw] text-[var(--color-text-secondary)]">
              <span>TypeScript 68%</span>
              <span>Python 22%</span>
              <span>SQL 10%</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
